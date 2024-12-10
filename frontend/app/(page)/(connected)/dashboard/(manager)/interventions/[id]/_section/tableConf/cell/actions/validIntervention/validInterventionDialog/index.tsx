'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useReadContract, useTransactionReceipt, useWriteContract } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { ethers } from 'ethers'
import { useQueryClient } from '@tanstack/react-query'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import InputFORM from '@/components/shared/form/InputFORM'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'
import { createDocument } from '@/actions/intervention/createDocument'
import { useGetAllUsers } from '@/hooks/queries/users/useGetAllUsers'
import { ChevronRight, File } from 'lucide-react'
import { bucketPath } from '@/constants/bucket'

/////////////////////////////////////////////////////////
// Document Component
/////////////////////////////////////////////////////////

const DocumentItem = ({ doc, dataIntervention, index, users }) => {
	const { documents, estateManagerId, tokenId, indexIntervention } = dataIntervention
	const dataCreated = documents?.[index]?.createdAtTimestamp ? new Date(documents?.[index]?.createdAtTimestamp) : null
	const { firstName, lastName } = users?.filter(({ id }) => documents?.[index]?.createdBy == id)?.[0] || {}

	console.log('------------')
	console.log(dataIntervention)
	console.log(doc)

	const file = `${bucketPath}/${estateManagerId}/${tokenId}/interventions/${indexIntervention}/${doc?.documentHash?.slice(2)}.png`

	const openImageInNewTab = () => {
		window.open(file, '_blank')
	}

	return (
		<div>
			<div className='space-y-2 flex flex-row items-center justify-between rounded-lg border p-4'>
				<div className='space-y-0.5'>
					<p className='font-bold peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm'>
						{doc?.title} <span className='text-xs font-light text-muted-foreground'> {dataCreated?.toLocaleString()}</span>
					</p>
					<p className='font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs'>
						<span className='text-xs font-bold'>HASH : </span>
						<span className='text-muted-foreground'>{doc?.documentHash?.slice(2)}</span>
					</p>

					{firstName && lastName && (
						<p className='font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs'>
							<span className='text-xs font-bold'>Ajouté par : </span>
							<span className='text-muted-foreground'>{firstName + ' ' + lastName}</span>
						</p>
					)}
				</div>

				<Button variant='outline' size='icon' onClick={openImageInNewTab}>
					<File />
				</Button>
			</div>
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
}

const ValidInterventionDialog = ({ dataIntervention }: ValidInterventionDialogProps) => {
	const [open, setOpen] = useState(false)

	const { address: currentAccount } = useAccount()
	const { data: users } = useGetAllUsers()
	const queryClient = useQueryClient()
	const { writeContract, isPending, isSuccess, data: hash, error } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })
	const [url, setUrl] = useState({})

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
		args: [BigInt(dataIntervention?.tokenId), currentAccount as `0x${string}`],
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

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		console.log('ici')
		try {
			// writeContract({
			// 	address: dataIntervention?.estateManagerId as `0x${string}`,
			// 	abi: EstateManagerArtifact.abi,
			// 	functionName: 'executeModule',
			// 	args: [moduleName, dataIntervention?.tokenId, fnName, encodedData],
			// 	account: currentAccount,
			// })
		} catch (error) {
			toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' })
		}
	}

	useEffect(() => {
		// async function handleWrite() {
		// 	if (isSuccess && hash && open) {
		// 		if (dataReceipt && dataReceipt.logs[0]?.address) {
		// 			let titleLOG
		// 			let createdByLOG
		// 			const documentHash = url?.documentHash
		// 			if (dataReceipt?.logs) {
		// 				dataReceipt?.logs.forEach((log, index) => {
		// 					const iface = new ethers.Interface(InterventionManagerArtifact.abi)
		// 					const decodedLog = new ethers.Interface(InterventionManagerArtifact.abi).parseLog(log)
		// 					const parsedLog = iface.parseLog(log)
		// 					if (decodedLog?.name == 'DocumentAdded') {
		// 						const args = parsedLog.args
		// 						titleLOG = args.title
		// 						createdByLOG = args.from
		// 					}
		// 				})
		// 			}
		// 			const createDocumentData = {
		// 				createdBy: createdByLOG,
		// 				interventionId: parseInt(dataIntervention?.id),
		// 				title: titleLOG,
		// 				documentHash: documentHash,
		// 			}
		// 			await createDocument(createDocumentData)
		// 			form.reset()
		// 			queryClient.invalidateQueries({ queryKey: ['useGetInterventionsByNft'] })
		// 			toast({ title: 'Document ajouter', description: 'Le document est bien ajouté' })
		// 			setUrl({})
		// 			setOpen(false)
		// 		}
		// 	}
		// }
		// handleWrite().catch((err) => {
		// 	toast({
		// 		variant: 'destructive',
		// 		title: 'Error',
		// 		description: 'An error occurred while processing the transaction receipt.',
		// 	})
		// })
	}, [isSuccess, hash, form, dataReceipt])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenuItem onClick={handleOpenDialog}>Valider l'intervention</DropdownMenuItem>

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
									data?.[dataIntervention?.indexIntervention]?.documents?.map((doc, i) => (
										<DocumentItem key={i} doc={doc} dataIntervention={dataIntervention} index={i} users={users} />
									))
								) : (
									<div className='flex h-[200px] shrink-0 items-center justify-center rounded-md border border-dashed'>
										<div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
											<h3 className='mt-4 text-lg font-semibold'>Aucun document</h3>
											<p className='mb-4 mt-2 text-sm text-muted-foreground'>Les intervenants n'ont pas encore ajouter de documents</p>
										</div>
									</div>
								)}
							</div>

							<Button type='submit' className='w-full' disabled={dataIntervention?.isValidated}>
								{dataIntervention?.isValidated ? 'Intervention déjà validé' : 'valider'}
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ValidInterventionDialog
