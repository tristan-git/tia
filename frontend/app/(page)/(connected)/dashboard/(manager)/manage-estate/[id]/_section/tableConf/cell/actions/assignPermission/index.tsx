import React, { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { useGetUsersPrestataire } from '@/hooks/queries/admin/useGetUsersPrestataire'
import { useTransactionReceipt, useWriteContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { assignPrestatairePermission } from '@/actions/users/assignPrestatairePermission'

const FormSchema = z.object({
	users: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			checked: z.boolean().default(false),
		})
	),
})

type AssignPermissionProps = { dataNft: any; disabled?: boolean; setOpenMenu: any }

const AssignPermission = ({ dataNft, disabled, setOpenMenu }: AssignPermissionProps) => {
	const queryClient = useQueryClient()
	const { data: users } = useGetUsersPrestataire()
	const [open, setOpen] = useState(false)

	const { data: hashWriteContract, isSuccess: isSuccessWrite, writeContract } = useWriteContract()
	const { data: dataWriteReceipt } = useTransactionReceipt({ hash: hashWriteContract })

	/////////////////////////////////////////////////////////
	// React Hook Form Setup
	/////////////////////////////////////////////////////////

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			users:
				users?.map((user: any) => ({
					id: user.id,
					name: `${user.firstName} ${user.lastName}`,
					checked: false,
				})) || [],
		},
	})

	const { fields, replace } = useFieldArray({
		control: form.control,
		name: 'users',
	})

	// Mise à jour des utilisateurs si la liste change
	useEffect(() => {
		if (users) {
			replace(
				users?.map((user: any) => ({
					id: user.id,
					name: `${user.firstName} ${user.lastName}`,
					checked: false,
				}))
			)
		}
	}, [users, replace])

	/////////////////////////////////////////////////////////
	// onSubmit
	/////////////////////////////////////////////////////////

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const selectedUsers = data.users.filter((user) => user.checked)
		const selectedUserIds = selectedUsers.map((user) => user.id)
		const walletAddresses = users?.filter((user) => selectedUserIds.includes(user.id)).map((user) => user.walletAddress)

		const tokenId = dataNft?.tokenId
		const moduleName = 'InterventionManager'

		if (walletAddresses?.length) {
			writeContract({
				address: dataNft?.estateManagerId,
				abi: EstateManagerArtifact.abi,
				functionName: 'grantExecuteModuleAccess',
				args: [tokenId, moduleName, walletAddresses[0] as `0x${string}`],
			})
		}
	}

	/////////////////////////////////////////////////////////
	// WRITE CONTRACT
	/////////////////////////////////////////////////////////

	useEffect(() => {
		async function handleWriteReceipt() {
			if (isSuccessWrite && hashWriteContract) {
				if (dataWriteReceipt && dataWriteReceipt.logs[0]?.address) {
					const { users: usersForms } = form.getValues()
					const selectedUsers = usersForms.filter((user) => user.checked)
					const selectedUserIds = selectedUsers.map((user) => user.id)
					const walletAddresses = users?.filter((user) => selectedUserIds.includes(user.id)).map((user) => user.walletAddress)

					const permissionData = {
						authorizedAddress: walletAddresses[0],
						moduleName: 'InterventionManager',
						tokenId: dataNft?.tokenId,
						estateManagerId: dataNft?.estateManagerId,
					}

					await assignPrestatairePermission(permissionData)
					form.reset()
					queryClient.invalidateQueries({ queryKey: ['getManagerEstate'] })
					toast({ title: 'permission assignée', description: `permission: assignée` })
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

	/////////////////////////////////////////////////////////
	// Render Component
	/////////////////////////////////////////////////////////

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (isOpen !== open) setOpen(isOpen)
			}}
		>
			<DropdownMenuItem
				onClick={(e) => {
					e.preventDefault()
					e.stopPropagation()
					setOpen(true)
				}}
			>
				Permissions interventions
			</DropdownMenuItem>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Permissions interventions</DialogTitle>
					<DialogDescription>Sélectionner les utilisateurs qui peuvent créer des interventions</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
							{fields.map((field, index) => (
								<FormItem key={field.id} className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={form.watch(`users.${index}.checked`)}
											onCheckedChange={(value) => form.setValue(`users.${index}.checked`, value as boolean)}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>{field.name}</FormLabel>
									</div>
								</FormItem>
							))}

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

export default AssignPermission
