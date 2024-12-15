'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useTransactionReceipt, useWriteContract } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { ethers } from 'ethers'
import { useQueryClient } from '@tanstack/react-query'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'
import { createDocument } from '@/actions/intervention/createDocument'
import SelectFORM from '@/components/shared/form/SelectFORM'
import { Input } from '@/components/ui/input'
import { FileIcon } from '@radix-ui/react-icons'
import { LoadingOverlay } from '@/components/provider/blockchainProvider'

const groups = [
	{
		selectLabelText: 'Documents Administratifs',
		values: [
			{ value: 'Contrat de location', text: 'Contrat de location' },
			{ value: 'Attestation d’assurance', text: 'Attestation d’assurance' },
			{ value: 'Facture', text: 'Facture' },
			{ value: 'Relevé de charges', text: 'Relevé de charges' },
		],
	},
	{
		selectLabelText: 'Documents Techniques',
		values: [
			{ value: 'Rapport technique', text: 'Rapport technique' },
			{ value: 'Diagnostic immobilier', text: 'Diagnostic immobilier' },
			{ value: 'Plan d’architecte', text: 'Plan d’architecte' },
			{ value: 'Guide d’utilisation', text: 'Guide d’utilisation' },
		],
	},
	{
		selectLabelText: 'Documents Juridiques',
		values: [
			{ value: 'Contrat de prestation', text: 'Contrat de prestation' },
			{ value: 'Avis d’expulsion', text: 'Avis d’expulsion' },
			{ value: 'Procès-verbal', text: 'Procès-verbal' },
		],
	},
	{
		selectLabelText: 'Documents Financiers',
		values: [
			{ value: 'Relevé bancaire', text: 'Relevé bancaire' },
			{ value: 'Bilan comptable', text: 'Bilan comptable' },
			{ value: 'Quittance de loyer', text: 'Quittance de loyer' },
		],
	},
	{
		selectLabelText: 'Autres Documents',
		values: [
			{ value: 'Photographie', text: 'Photographie' },
			{ value: 'Vidéo', text: 'Vidéo' },
			{ value: 'Note manuscrite', text: 'Note manuscrite' },
		],
	},
]

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	title: z.string().min(2, { message: 'Requis' }),
	file: z.any(),
})

/////////////////////////////////////////////////////////
// AddDocumentDialog
/////////////////////////////////////////////////////////

type AddDocumentDialogProps = {
	dataIntervention: any
	disabled: boolean
}

const AddDocumentDialog = ({ dataIntervention, disabled }: AddDocumentDialogProps) => {
	const [open, setOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const { address: currentAccount } = useAccount()
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
	// Init form
	/////////////////////////////////////////////////////////

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'all',
		resolver: zodResolver(FormSchema),
		defaultValues: { title: '' },
	})

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		try {
			setIsSubmitting(true)
			const formData = new FormData()
			formData.append('idEstate', dataIntervention?.estateManagerId)
			formData.append('tokenId', dataIntervention?.tokenId)
			formData.append('indexIntervention', dataIntervention?.indexIntervention)
			for (const key in data as any) {
				if (key === 'file') formData.append(key, data[key][0])
				else formData.append(key, data[key])
			}
			const res = await fetch(`/api/nft/document`, {
				method: 'POST',
				body: formData,
			}).then((res) => res.json())
			if (res.success) {
				// Ajouter le document

				const moduleName = 'InterventionManager'
				const fnName = 'addDocument'

				const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
					['uint256', 'string', 'bytes32'],
					[parseInt(dataIntervention?.indexIntervention), data.title, '0x' + res.hashHex]
				)

				writeContract({
					address: dataIntervention?.estateManagerId as `0x${string}`,
					abi: EstateManagerArtifact.abi,
					functionName: 'executeModule',
					args: [moduleName, dataIntervention?.tokenId, fnName, encodedData],
					account: currentAccount,
				})

				setUrl({ blob: res.blob, documentHash: res.hashHex, fileExtension: res.fileExtension })
			}
		} catch (error) {
			toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' })
			form.reset()
			setIsSubmitting(false)
			setOpen(false)
		}
	}

	useEffect(() => {
		async function handleWrite() {
			if (isSuccess && hash && open) {
				if (dataReceipt && dataReceipt.logs[0]?.address) {
					let titleLOG
					let createdByLOG
					const documentHash = url?.documentHash

					if (dataReceipt?.logs) {
						dataReceipt?.logs.forEach((log, index) => {
							const iface = new ethers.Interface(InterventionManagerArtifact.abi)
							const decodedLog = new ethers.Interface(InterventionManagerArtifact.abi).parseLog(log)
							const parsedLog = iface.parseLog(log)
							if (decodedLog?.name == 'DocumentAdded') {
								const args = parsedLog.args
								titleLOG = args.title
								createdByLOG = args.from
							}
						})
					}

					const createDocumentData = {
						createdBy: createdByLOG,
						interventionId: parseInt(dataIntervention?.id),
						title: titleLOG,
						documentHash: documentHash,
						fileExtension: url?.fileExtension,
					}

					await createDocument(createDocumentData)

					form.reset()
					queryClient.invalidateQueries()
					toast({ title: 'Document ajouter', description: 'Le document est bien ajouté' })
					setUrl({})
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
		<>
			<Dialog open={open} onOpenChange={(newState) => !isSubmitting && setOpen(newState)}>
				<DropdownMenuItem disabled={disabled} onClick={handleOpenDialog}>
					Ajouter un document
				</DropdownMenuItem>

				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Ajouter un nouveau document</DialogTitle>
						<DialogDescription>{`Pour intervention : ${dataIntervention.title}`}</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-0'>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
								<div className='grid w-full items-center gap-4'>
									<div className='grid w-full items-center gap-4'>
										<SelectFORM form={form} name='title' placeholder='Type de document' selectGroup={{ groups }} />
									</div>

									<div
										className='border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center cursor-pointer'
										onClick={() => document.getElementById('file')?.click()}
									>
										<FileIcon className='w-12 h-12' />
										<span className='text-sm font-medium text-gray-500'>Cliquer pour importer un document</span>
										<span className='text-xs text-gray-500'>PDF, image, video..</span>

										<Input id='file' type='file' placeholder='File' {...form.register('file')} className='hidden' />
									</div>
								</div>

								<Button type='submit' className='w-full' disabled={isSubmitting}>
									{isSubmitting ? 'En cours...' : 'Ajouter'}
								</Button>
							</form>
						</Form>
					</div>
				</DialogContent>
			</Dialog>

			<LoadingOverlay isActive={isSubmitting && open} />
		</>
	)
}

export default AddDocumentDialog
