import React, { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useDeployContract, useTransactionReceipt, useWriteContract } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'
import { addressEstateFactory } from '@/constants/contract'
import { EstateManagerFactoryArtifact } from '@/constants/artifacts/EstateManagerFactory'
import { assignModule } from '@/actions/admin/assignModule'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	InterventionManager: z.boolean().default(false).optional(),
	AutreModule: z.boolean().default(false).optional(),
})

/////////////////////////////////////////////////////////
// COMPONENT
/////////////////////////////////////////////////////////

type AddProposalProps = { contractAddress: any; disabled?: boolean; setOpenMenu: any }

const AssignModule = ({ contractAddress, disabled, setOpenMenu }: AddProposalProps) => {
	const { address: currentAccount } = useAccount()
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	const { deployContract, data: hashDeployed, isSuccess: isSuccessDeployed } = useDeployContract()
	const { data: dataDeployedReceipt } = useTransactionReceipt({ hash: hashDeployed })
	const { data: hashWriteContract, isSuccess: isSuccessWrite, writeContract } = useWriteContract()
	const { data: dataWriteReceipt } = useTransactionReceipt({ hash: hashWriteContract })

	const handleOpenDialog = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setOpen(true)
	}

	/////////////////////////////////////////////////////////
	// useForm
	/////////////////////////////////////////////////////////

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { AutreModule: false, InterventionManager: true },
	})

	/////////////////////////////////////////////////////////
	// onSubmit
	/////////////////////////////////////////////////////////

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { InterventionManager } = data
		// Module InterventionManager selected
		if (InterventionManager) {
			deployContract({
				abi: InterventionManagerArtifact.abi,
				args: [contractAddress],
				bytecode: InterventionManagerArtifact.bytecode,
			})
		} else {
			setOpen(false)
			setOpenMenu(false)
		}
	}

	/////////////////////////////////////////////////////////
	// DEPLOYED CONTRACT
	/////////////////////////////////////////////////////////

	useEffect(() => {
		async function handleDeploymentReceipt() {
			const { InterventionManager } = form.getValues()
			if (isSuccessDeployed && hashDeployed && open) {
				if (dataDeployedReceipt && dataDeployedReceipt?.logs[0]?.address && InterventionManager) {
					const addressEstateManager = contractAddress
					const moduleName = 'InterventionManager'
					const moduleAddress = dataDeployedReceipt.logs[0]?.address

					writeContract({
						address: addressEstateFactory,
						abi: EstateManagerFactoryArtifact.abi,
						functionName: 'registerModuleInManager',
						args: [addressEstateManager as `0x${string}`, moduleName, moduleAddress],
					})
				}
			}
		}

		handleDeploymentReceipt().catch((err) => {
			console.error('Error handling deployment receipt:', err)
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'An error occurred while processing the transaction receipt.',
			})
		})
	}, [isSuccessDeployed, hashDeployed, form, dataDeployedReceipt, queryClient])

	/////////////////////////////////////////////////////////
	// WRITE CONTRACT
	/////////////////////////////////////////////////////////

	useEffect(() => {
		async function handleWriteReceipt() {
			if (isSuccessWrite && hashWriteContract) {
				if (dataWriteReceipt && dataWriteReceipt.logs[0]?.address) {
					//  dataDeployedReceipt.logs[0]?.address
					const moduleData = {
						moduleName: 'InterventionManager',
						moduleAddress: dataDeployedReceipt?.logs[0]?.address,
						addressEstateManager: contractAddress,
						blockHash: dataDeployedReceipt?.blockHash,
						blockNumber: dataDeployedReceipt?.blockNumber,
						timestamp: new Date(),
						admin: currentAccount,
					}

					await assignModule(moduleData)
					form.reset()
					queryClient.invalidateQueries({ queryKey: ['getManagerEstate'] })
					toast({ title: 'Module assigné', description: `MODULE: Intervention Manager` })
					setOpen(false)
					setOpenMenu(false)
				}
			}
		}

		handleWriteReceipt().catch((err) => {
			console.error('Error handling deployment receipt:', err)
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'An error occurred while processing the transaction receipt.',
			})
		})
	}, [isSuccessWrite, hashWriteContract, form, dataWriteReceipt, queryClient])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenuItem onClick={handleOpenDialog} disabled={disabled}>
				Assigner un module
			</DropdownMenuItem>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Assigner des modules</DialogTitle>
					<DialogDescription>texte explication.</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
							<FormField
								control={form.control}
								name='InterventionManager'
								render={({ field }) => (
									<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className='space-y-1 leading-none'>
											<FormLabel>Module intervention</FormLabel>
											<FormDescription>Description du module intervention</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='AutreModule'
								render={({ field }) => (
									<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className='space-y-1 leading-none'>
											<FormLabel>Module notaire</FormLabel>
											<FormDescription>Démo : ce module n'existe pas</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							<Button type='submit' className='w-full'>
								Assigner
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default AssignModule
