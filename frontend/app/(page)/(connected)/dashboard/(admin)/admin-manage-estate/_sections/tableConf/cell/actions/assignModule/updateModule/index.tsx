import React, { useEffect, useState } from 'react'

import { useAccount, useDeployContract, useTransactionReceipt, useWriteContract } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, Form } from '@/components/ui/form'
import { useHaveModuleRegistered } from '@/hooks/queries/role/useHaveModuleRegistered'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'
import { EstateManagerFactoryArtifact } from '@/constants/artifacts/EstateManagerFactory'
import { addressEstateFactory } from '@/constants/contract'
import { assignModule } from '@/actions/admin/assignModule'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({ modulePermission: z.boolean() })

type UpdateModuleProps = {
	moduleData: any
	contractAddress: any
	managerAddress: any
}

const UpdateModule = ({ moduleData, contractAddress, managerAddress }: UpdateModuleProps) => {
	const { address: currentAccount } = useAccount()
	const queryClient = useQueryClient()

	console.log(managerAddress)

	const { deployContract, data: hashDeployed, isSuccess: isSuccessDeployed } = useDeployContract()
	const { data: dataDeployedReceipt } = useTransactionReceipt({ hash: hashDeployed })
	const { data: hashWriteContract, isSuccess: isSuccessWrite, writeContract } = useWriteContract()
	const { data: dataWriteReceipt } = useTransactionReceipt({ hash: hashWriteContract })
	const { id, title, subTitle, Icon, moduleName } = moduleData || {}
	const [defaultPermission, setDefaultPermission] = useState<boolean>(false)
	const haveModuleRegistered = useHaveModuleRegistered(contractAddress, moduleName)

	useEffect(() => {
		if (typeof haveModuleRegistered === 'boolean') {
			setDefaultPermission(haveModuleRegistered)
			form.setValue('modulePermission', haveModuleRegistered)
		}
	}, [haveModuleRegistered])

	/////////////////////////////////////////////////////////
	// Init form
	/////////////////////////////////////////////////////////

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'all',
		resolver: zodResolver(FormSchema),
		defaultValues: { modulePermission: defaultPermission },
	})

	/////////////////////////////////////////////////////////
	// Handle Switch Change
	/////////////////////////////////////////////////////////

	const handleSwitchChange = (value: boolean) => {
		form.setValue('modulePermission', value)
		form.handleSubmit(onSubmit)()
	}

	/////////////////////////////////////////////////////////
	// Handle Card Click
	/////////////////////////////////////////////////////////

	const handleCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if ((event.target as HTMLElement).tagName !== 'INPUT' && (id == 1 || haveModuleRegistered)) {
			const currentValue = form.getValues('modulePermission')
			form.setValue('modulePermission', !currentValue)
			form.handleSubmit(onSubmit)()
		}
	}

	/////////////////////////////////////////////////////////
	// 1 - onSubmit on deploy le nouveau contrat du module
	/////////////////////////////////////////////////////////

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		// seulement le module intervention existe
		if (id == 1 && !haveModuleRegistered) {
			try {
				deployContract({
					abi: InterventionManagerArtifact.abi,
					args: [contractAddress, managerAddress],
					bytecode: InterventionManagerArtifact.bytecode,
				})
			} catch (error) {
				form.reset()
				toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' })
			}
		}
	}

	/////////////////////////////////////////////////////////
	// 2 - On lie le module au contrat principal des batiment
	/////////////////////////////////////////////////////////

	useEffect(() => {
		async function handleDeploymentReceipt() {
			if (isSuccessDeployed && hashDeployed) {
				if (dataDeployedReceipt && dataDeployedReceipt?.logs[0]?.address) {
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
	// 3 - on sauvegarde en BDD
	/////////////////////////////////////////////////////////

	useEffect(() => {
		async function handleWriteReceipt() {
			if (isSuccessWrite && hashWriteContract && id == 1) {
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

					queryClient.invalidateQueries({ queryKey: ['getManagerEstate'] })
					toast({ title: 'Module assigné', description: `MODULE: Intervention Manager` })
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<FormField
					disabled={id !== 1 || haveModuleRegistered}
					control={form.control}
					name='modulePermission'
					render={({ field }) => (
						<FormItem
							onClick={handleCardClick}
							className={cn(
								'flex flex-row items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-primary-foreground',
								id !== 1 || haveModuleRegistered ? 'cursor-not-allowed' : ''
							)}
						>
							<div className='space-y-0.5 flex space-x-2'>
								<span className='relative flex shrink-0 overflow-hidden rounded-full h-9 w-9'>
									<img className='aspect-square h-full w-full' alt='Avatar' src='https://ui.shadcn.com/avatars/02.png' />
								</span>
								<div>
									<FormLabel className='text-base'>{title}</FormLabel>
									<FormDescription>{subTitle}</FormDescription>
								</div>
							</div>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={handleSwitchChange} disabled={id !== 1 || haveModuleRegistered} />
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default UpdateModule
