import React, { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { useAccount, useTransactionReceipt, useWriteContract } from 'wagmi'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, Form } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { ethers } from 'ethers'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'
import { updateDocumentPermission } from '@/actions/intervention/updateDocumentPermission'
import { usePermissionDocument } from '@/hooks/role/usePermissionDocument'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({ permissionUser: z.boolean() })

type UpdatePermissionDocumentProps = {
	user: any
	dataIntervention: any
}

const UpdatePermissionDocument = ({ user, dataIntervention }: UpdatePermissionDocumentProps) => {
	const { address: currentAccount } = useAccount()
	const queryClient = useQueryClient()
	const { writeContract, isPending, isSuccess, data: hash, error } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })
	const { firstName, lastName, walletAddress } = user || {}

	// State to manage haveAccess
	const [defaultPermission, setDefaultPermission] = useState<boolean>(false)

	// Fetch permission status
	const haveAccess = usePermissionDocument(
		dataIntervention?.moduleId,
		dataIntervention?.tokenId,
		walletAddress,
		parseInt(dataIntervention?.indexIntervention)
	)

	// Sync haveAccess to the form when it changes
	useEffect(() => {
		if (typeof haveAccess === 'boolean') {
			setDefaultPermission(haveAccess)
			form.setValue('permissionUser', haveAccess)
		}
	}, [haveAccess])

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
			const moduleName = 'InterventionManager'
			const fnName = permissionUser ? 'grantInterventionAccess' : 'revokeInterventionAccess'
			const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
				['uint256', 'address'],
				[parseInt(dataIntervention?.indexIntervention), walletAddress]
			)

			writeContract({
				address: dataIntervention?.estateManagerId as `0x${string}`,
				abi: EstateManagerArtifact.abi,
				functionName: 'executeModule',
				args: [moduleName, dataIntervention?.tokenId, fnName, encodedData as `0x${string}`],
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
			if (isSuccess && hash) {
				if (dataReceipt && dataReceipt.logs[0]?.address) {
					let tokenIdLOG
					let indexInterventionLOG
					let accountLOG
					let fromLOG
					let grantedLOG

					if (dataReceipt?.logs) {
						// On recupere l'event "InterventionAccessChanged"
						dataReceipt?.logs.forEach((log, _index) => {
							const iface = new ethers.Interface(InterventionManagerArtifact.abi)
							const decodedLog = new ethers.Interface(InterventionManagerArtifact.abi).parseLog(log)
							const parsedLog = iface.parseLog(log)
							if (decodedLog?.name == 'InterventionAccessChanged') {
								const { tokenId, interventionIndex, account, from, granted }: any = parsedLog?.args || {}

								tokenIdLOG = tokenId.toString()
								indexInterventionLOG = interventionIndex.toString()
								accountLOG = account
								fromLOG = from
								grantedLOG = granted
							}
						})
					}

					const permissionDocumentData = {
						validatedBy: fromLOG,
						interventionId: parseInt(dataIntervention?.id),
						indexIntervention: indexInterventionLOG,
						tokenId: tokenIdLOG,
						userAccountGranted: accountLOG,
						granted: grantedLOG,
						estateManagerId: dataIntervention?.estateManagerId,
					}
					await updateDocumentPermission(permissionDocumentData)
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
								<div>
									<FormLabel className='text-base'>{`${firstName} ${lastName}`}</FormLabel>
									<FormDescription>Receive emails about new products, features, and more.</FormDescription>
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

export default UpdatePermissionDocument
