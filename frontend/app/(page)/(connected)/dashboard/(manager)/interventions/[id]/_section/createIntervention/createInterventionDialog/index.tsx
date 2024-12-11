'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useTransactionReceipt, useWatchContractEvent, useWriteContract } from 'wagmi'
import { ethers } from 'ethers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import InputFORM from '@/components/shared/form/InputFORM'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { createIntervention } from '@/actions/intervention/createIntervention'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import SelectFORM from '@/components/shared/form/SelectFORM'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	title: z.string().min(2, { message: 'Requis' }),
})

/////////////////////////////////////////////////////////
// CreateInterventionDialog
/////////////////////////////////////////////////////////

type CreateInterventionDialogProps = {
	idEstate: any
	tokenId: any
	addressInterventionManager: any
	disabled: any
}

const CreateInterventionDialog = ({ idEstate, tokenId, addressInterventionManager, disabled }: CreateInterventionDialogProps) => {
	const [open, setOpen] = useState(false)

	const { address: currentAccount } = useAccount()
	const queryClient = useQueryClient()
	const { writeContract, isPending, isSuccess, data: hash, error, failureReason } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })

	/////////////////////////////////////////////////////////
	// FORM INIT
	/////////////////////////////////////////////////////////

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'all',
		resolver: zodResolver(FormSchema),
		defaultValues: { title: '' },
	})

	/////////////////////////////////////////////////////////
	// onSubmit
	/////////////////////////////////////////////////////////

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		try {
			const { title } = data

			const moduleName = 'InterventionManager'
			const fnName = 'addIntervention'
			const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(['string'], [title])

			writeContract({
				address: idEstate,
				abi: EstateManagerArtifact.abi,
				functionName: 'executeModule',
				args: [moduleName, tokenId, fnName, encodedData],
				account: currentAccount,
			})
		} catch (error) {
			toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' })
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
					let titleLOG
					let createdByLOG
					let indexInterventionLOG

					if (dataReceipt?.logs) {
						dataReceipt?.logs.forEach((log, index) => {
							const iface = new ethers.Interface(InterventionManagerArtifact.abi)
							const decodedLog = new ethers.Interface(InterventionManagerArtifact.abi).parseLog(log)
							const parsedLog = iface.parseLog(log)
							if (decodedLog?.name == 'InterventionAdded') {
								const args = parsedLog.args
								tokenIdLOG = args.tokenId.toString()
								titleLOG = args.title
								createdByLOG = args.from
								indexInterventionLOG = args.interventionIndex.toString()
							}
						})
					}

					const createInterventionData = {
						tokenId: tokenIdLOG,
						title: titleLOG,
						estateManagerId: idEstate,
						createdBy: createdByLOG,
						indexIntervention: indexInterventionLOG,
					}
					await createIntervention(createInterventionData)
					form.reset()
					queryClient.invalidateQueries({ queryKey: ['useGetInterventionsByNft'] })
					toast({ title: 'Intervention ajouter', description: 'Intervention est bien ajouté' })
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
		})
	}, [isSuccess, hash, form, dataReceipt])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild disabled={disabled}>
				{disabled ? <Button disabled={disabled}>Creer une intervention</Button> : <Button>Creer une intervention</Button>}
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Créer une intervention</DialogTitle>
					<DialogDescription>Entrer le type de l'intervention sur le bâtiment</DialogDescription>
				</DialogHeader>

				<div className='grid gap-4 py-0'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<div className='grid w-full items-center gap-4'>
								<SelectFORM
									form={form}
									name='title'
									placeholder="Type d'intervention"
									selectGroup={{
										groups: [
											{
												selectLabelText: 'Maintenance et Réparation',
												values: [
													{ value: 'Plomberie', text: 'Plomberie' },
													{ value: 'Électricité', text: 'Électricité' },
													{ value: 'Chauffage', text: 'Chauffage' },
													{ value: 'Toiture', text: 'Toiture' },
												],
											},
											{
												selectLabelText: 'Service Client et Administration',
												values: [
													{ value: 'Gestion de contrat', text: 'Gestion de contrat' },
													{ value: 'Réclamations', text: 'Réclamations' },
													{ value: 'Demandes administratives', text: 'Demandes administratives' },
												],
											},
											{
												selectLabelText: 'Inspection et Audit',
												values: [
													{ value: 'Inspection technique', text: 'Inspection technique' },
													{ value: 'Audit énergétique', text: 'Audit énergétique' },
													{ value: 'Contrôle qualité', text: 'Contrôle qualité' },
												],
											},
											{
												selectLabelText: 'Nettoyage et Entretien',
												values: [
													{ value: 'Nettoyage régulier', text: 'Nettoyage régulier' },
													{ value: 'Entretien des espaces verts', text: 'Entretien des espaces verts' },
													{ value: 'Nettoyage après travaux', text: 'Nettoyage après travaux' },
												],
											},
										],
									}}
								/>
							</div>
							<Button type='submit' className='w-full'>
								Créer
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default CreateInterventionDialog
