import React, { useEffect, useState } from 'react'

import { useTransactionReceipt, useWriteContract } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ethers } from 'ethers'
import { z } from 'zod'

import { FormControl, FormField, FormItem, FormLabel, Form } from '@/components/ui/form'
import { assignPrestatairePermission } from '@/actions/users/assignPrestatairePermission'
import { useHaveAccessModule } from '@/hooks/role/usehaveAccessModule'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({ permissionUser: z.boolean() })

type UpdatePermissionInterventionProps = {
	user: any
	dataNft: any
}

/////////////////////////////////////////////////////////
// UpdatePermissionIntervention
/////////////////////////////////////////////////////////

const UpdatePermissionIntervention = ({ user, dataNft }: UpdatePermissionInterventionProps) => {
	const queryClient = useQueryClient()
	const { writeContract, isPending, isSuccess, data: hash, error } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })
	const { firstName, lastName, walletAddress } = user || {}
	const [defaultPermission, setDefaultPermission] = useState<boolean>(false)

	const haveAccessModule = useHaveAccessModule({
		contractAddress: dataNft?.estateManagerId,
		tokenId: dataNft?.tokenId,
		userAddress: walletAddress as `0x${string}`,
	})

	// Sync haveAccess to the form when it changes
	useEffect(() => {
		if (typeof haveAccessModule === 'boolean') {
			setDefaultPermission(haveAccessModule)
			form.setValue('permissionUser', haveAccessModule)
		}
	}, [haveAccessModule])

	/////////////////////////////////////////////////////////
	// Init form
	/////////////////////////////////////////////////////////

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'all',
		resolver: zodResolver(FormSchema),
		defaultValues: { permissionUser: defaultPermission },
	})

	/////////////////////////////////////////////////////////
	// Handle Switch Change
	/////////////////////////////////////////////////////////

	const handleSwitchChange = (value: boolean) => {
		form.setValue('permissionUser', value)
		form.handleSubmit(onSubmit)()
	}

	/////////////////////////////////////////////////////////
	// Handle Card Click
	/////////////////////////////////////////////////////////

	const handleCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		// Vérifie si le clic ne vient pas directement du switch
		if ((event.target as HTMLElement).tagName !== 'INPUT') {
			const currentValue = form.getValues('permissionUser')
			form.setValue('permissionUser', !currentValue)
			form.handleSubmit(onSubmit)()
		}
	}

	/////////////////////////////////////////////////////////
	// onSubmit
	/////////////////////////////////////////////////////////

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		const { permissionUser } = data || {}

		try {
			const tokenId = dataNft?.tokenId

			const moduleName = 'InterventionManager'

			writeContract({
				address: dataNft?.estateManagerId,
				abi: EstateManagerArtifact.abi,
				functionName: permissionUser ? 'grantExecuteModuleAccess' : 'revokeExecuteModuleAccess',
				args: [tokenId, moduleName, walletAddress as `0x${string}`],
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
			if (isSuccess && hash) {
				if (dataReceipt && dataReceipt.logs[0]?.address) {
					let tokenIdLOG
					let grantedLOG
					let authorizedAddressLOG
					if (dataReceipt?.logs) {
						// On recupere l'event "ModuleRoleAssigned" || "ModuleRoleRevoked"
						dataReceipt?.logs.forEach((log, _index) => {
							const iface = new ethers.Interface(EstateManagerArtifact.abi)
							const decodedLog = new ethers.Interface(EstateManagerArtifact.abi).parseLog(log)
							const parsedLog = iface.parseLog(log)

							if (decodedLog?.name == 'ModuleRoleAssigned' || decodedLog?.name == 'ModuleRoleRevoked') {
								const { tokenId, authorizedAddress }: any = parsedLog?.args || {}
								tokenIdLOG = tokenId.toString()
								authorizedAddressLOG = authorizedAddress
								grantedLOG = decodedLog?.name == 'ModuleRoleAssigned' ? true : false
							}
						})
					}

					const permissionInterventionData = {
						isGranted: grantedLOG,
						authorizedAddress: authorizedAddressLOG,
						moduleName: 'InterventionManager',
						tokenId: tokenIdLOG,
						estateManagerId: dataNft?.estateManagerId,
					}

					await assignPrestatairePermission(permissionInterventionData)
					queryClient.invalidateQueries()
					toast({ title: 'Permission mis à jours', description: 'Permission mis à jours' })
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<FormField
					control={form.control}
					name='permissionUser'
					render={({ field }) => (
						<FormItem
							onClick={handleCardClick}
							className='flex flex-row items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-primary-foreground'
						>
							<div className='space-y-0.5 flex space-x-2'>
								<span className='relative flex shrink-0 overflow-hidden rounded-full h-9 w-9'>
									<img className='aspect-square h-full w-full' alt='Avatar' src='https://ui.shadcn.com/avatars/02.png' />
								</span>
								<div className='flex-col flex justify-center'>
									<FormLabel className='text-base'>{`${firstName} ${lastName}`}</FormLabel>
								</div>
							</div>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={handleSwitchChange} />
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default UpdatePermissionIntervention
