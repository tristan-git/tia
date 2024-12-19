'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useReadContract, useTransactionReceipt, useWriteContract } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { ethers } from 'ethers'
import { useQueryClient } from '@tanstack/react-query'
import { File } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'
import { useGetAllUsers } from '@/hooks/queries/users/useGetAllUsers'
import { bucketPath } from '@/constants/bucket'
import { validIntervention } from '@/actions/intervention/validIntervention'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EyeOpenIcon, FileIcon, UploadIcon } from '@radix-ui/react-icons'
import { LoadingOverlay } from '@/components/provider/blockchainProvider'

/////////////////////////////////////////////////////////
// Document Component
/////////////////////////////////////////////////////////

const DocumentItem = ({ doc, dataIntervention, index, users }: any) => {
	const { documents, estateManagerId, tokenId, indexIntervention } = dataIntervention
	const dataCreated = documents?.[index]?.createdAtTimestamp ? new Date(documents?.[index]?.createdAtTimestamp) : null
	const { firstName, lastName } = users?.filter(({ id }) => documents?.[index]?.createdBy == id)?.[0] || {}
	const fileExtension = documents?.[index]?.fileExtension

	const file = `${bucketPath}/${estateManagerId}/${tokenId}/interventions/${indexIntervention}/${doc?.documentHash?.slice(
		2
	)}.${fileExtension}`

	const openImageInNewTab = () => {
		window.open(file, '_blank')
	}

	return (
		<div className='p-4  rounded-lg  items-start justify-between space-y-2 flex flex-row  border mb-2'>
			<div className='flex items-start space-x-4'>
				<div className='flex-shrink-0'>
					<div className='p-2 bg-gray-100 rounded-md'>
						<FileIcon className='w-6 h-6 text-gray-500' />
					</div>
				</div>

				<div className='space-y-1'>
					<p className='text-[13px] font-bold uppercase'>
						{doc?.title}
						<span className='block text-xs opacity-50 font-light'>{dataCreated?.toLocaleString()}</span>
					</p>

					<p className='text-xs '>
						<span className='font-semibold'>HASH: </span>
						{doc?.documentHash?.slice(2)}
					</p>

					<p className='text-xs '>
						<span className='font-semibold'>Prestataire: </span>
						{firstName + ' ' + lastName}
					</p>
				</div>
			</div>

			<Button
				variant='outlineDefault'
				size='icon'
				onClick={(event) => {
					event.stopPropagation()
					event.preventDefault()
					openImageInNewTab()
				}}
			>
				<UploadIcon />
			</Button>
		</div>
	)
}

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({})

/////////////////////////////////////////////////////////
// ValidInterventionDialog
/////////////////////////////////////////////////////////

type ValidInterventionDialogProps = {
	dataIntervention: any
	disabled: boolean
}

const ValidInterventionDialog = ({ dataIntervention, disabled }: ValidInterventionDialogProps) => {
	const [open, setOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { address: currentAccount } = useAccount()
	const { data: users } = useGetAllUsers()
	const queryClient = useQueryClient()
	const { writeContract, isPending, isSuccess, data: hash, error, failureReason } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })
	const walletPrestataire = users?.filter(({ id }) => id == dataIntervention?.createdBy)?.[0]?.walletAddress

	const handleOpenDialog = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setOpen(true)
	}

	/////////////////////////////////////////////////////////
	// Request Blockchain
	/////////////////////////////////////////////////////////

	const { data } = useReadContract({
		abi: InterventionManagerArtifact.abi,
		address: dataIntervention?.moduleId,
		functionName: 'getInterventions',
		args: [BigInt(dataIntervention?.tokenId), walletPrestataire as `0x${string}`],
		account: currentAccount,
	})

	/////////////////////////////////////////////////////////
	// Init form
	/////////////////////////////////////////////////////////

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'all',
		resolver: zodResolver(FormSchema),
		defaultValues: {},
	})

	/////////////////////////////////////////////////////////
	// onSubmit
	/////////////////////////////////////////////////////////

	const onSubmit = async (_data: z.infer<typeof FormSchema>) => {
		try {
			setIsSubmitting(true)
			const moduleName = 'InterventionManager'
			const fnName = 'validateIntervention'
			const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
				['uint256', 'address'],
				[parseInt(dataIntervention?.indexIntervention), walletPrestataire]
			)

			writeContract({
				address: dataIntervention?.estateManagerId as `0x${string}`,
				abi: EstateManagerArtifact.abi,
				functionName: 'executeModule',
				args: [moduleName, dataIntervention?.tokenId, fnName, encodedData],
				account: currentAccount,
			})
		} catch (error) {
			toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' })
			form.reset()
			setIsSubmitting(false)
			setOpen(false)
		}
	}

	/////////////////////////////////////////////////////////
	// handleWrite
	/////////////////////////////////////////////////////////

	useEffect(() => {
		async function handleWrite() {
			if (isSuccess && hash && open) {
				if (dataReceipt && dataReceipt.logs[0]?.address) {
					let tokenIdLOG
					let validatedByLOG
					let indexInterventionLOG

					if (dataReceipt?.logs) {
						dataReceipt?.logs.forEach((log, index) => {
							const iface = new ethers.Interface(InterventionManagerArtifact.abi)
							const decodedLog = new ethers.Interface(InterventionManagerArtifact.abi).parseLog(log)
							const parsedLog = iface.parseLog(log)
							if (decodedLog?.name == 'InterventionValidated') {
								const args = parsedLog.args
								tokenIdLOG = args.tokenId.toString()
								validatedByLOG = args.from
								indexInterventionLOG = args.interventionIndex.toString()
							}
						})
					}

					const validInterventionData = {
						validatedBy: validatedByLOG,
						interventionId: parseInt(dataIntervention?.id),
						indexIntervention: indexInterventionLOG,
						tokenId: tokenIdLOG,
					}
					await validIntervention(validInterventionData)
					form.reset()
					queryClient.invalidateQueries()
					toast({ title: 'Intervention validé', description: 'Intervention est bien validé' })
					setIsSubmitting(false)
					setOpen(false)
				}
			}
		}
		handleWrite().catch((err) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'An error occurred while processing the transaction receipt.',
			})
			form.reset()
			setIsSubmitting(false)
			setOpen(false)
		})
	}, [isSuccess, hash, form, dataReceipt])

	return (
		<Dialog open={open} onOpenChange={(newState) => !isSubmitting && setOpen(newState)}>
			<DropdownMenuItem disabled={disabled} onClick={handleOpenDialog}>
				Valider l'intervention
			</DropdownMenuItem>

			<DialogContent className='sm:max-w-[700px]'>
				<DialogHeader>
					<DialogTitle>Valider l'intervention</DialogTitle>
					<DialogDescription>{`Motif de l'intervention : ${dataIntervention.title}`}</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-0'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<div className='grid w-full items-center gap-2'>
								{data?.[dataIntervention?.indexIntervention]?.documents?.length ? (
									<ScrollArea className={data?.[dataIntervention?.indexIntervention]?.documents?.length > 3 ? 'h-[305px]' : 'max-h-fit'}>
										{data?.[dataIntervention?.indexIntervention]?.documents?.map((doc, i) => (
											<DocumentItem key={i} doc={doc} dataIntervention={dataIntervention} index={i} users={users} />
										))}
									</ScrollArea>
								) : (
									<div className='flex h-[200px] shrink-0 items-center justify-center rounded-md border border-dashed'>
										<div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
											<h3 className='mt-4 text-lg font-semibold'>Aucun document</h3>
											<p className='mb-4 mt-2 text-sm text-muted-foreground'>Les intervenants n'ont pas encore ajouter de documents</p>
										</div>
									</div>
								)}
							</div>

							<Button type='submit' className='w-full' disabled={dataIntervention?.isValidated || isSubmitting}>
								{isSubmitting ? 'En cours...' : dataIntervention?.isValidated ? 'Intervention déjà validé' : 'valider'}
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
			<LoadingOverlay isActive={isSubmitting && open} />
		</Dialog>
	)
}

export default ValidInterventionDialog
