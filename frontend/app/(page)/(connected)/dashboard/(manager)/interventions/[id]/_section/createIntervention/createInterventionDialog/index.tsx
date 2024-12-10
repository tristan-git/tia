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

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	title: z.string().min(2, { message: 'Sujet non valide' }).max(20, { message: 'Trop long' }),
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
					<DialogDescription>Entrer les détail de l'intervention</DialogDescription>
				</DialogHeader>

				<div className='grid gap-4 py-0'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<div className='grid w-full items-center gap-4'>
								<InputFORM form={form} name='title' placeholder="sujet de l'intervention" className='w-full' />
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
