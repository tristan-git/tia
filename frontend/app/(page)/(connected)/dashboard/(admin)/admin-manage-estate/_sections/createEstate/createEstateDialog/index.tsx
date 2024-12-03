'use client'

import React, { useEffect, useState } from 'react'
import { useTransactionReceipt, useWriteContract } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import InputFORM from '@/components/shared/form/InputFORM'
import SelectFORM from '@/components/shared/form/SelectFORM'
import { useGetManagersUsers } from '@/hooks/queries/manager/managerGetUsers'
import { EstateManagerFactoryArtifact } from '@/constants/artifacts/EstateManagerFactory'
import { addressEstateFactory } from '@/constants/contract'
import { createEstateManager } from '@/actions/manager/createEstateManager'

const formatForSelect = (users: any) =>
	users?.map((user: any) => ({
		value: user.walletAddress,
		text: `${user.firstName} ${user.lastName}`,
	}))

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	adminAddress: z.string().refine((value) => /^0x[a-fA-F0-9]{40}$/.test(value), { message: 'Adresse Ethereum non valide' }),
	managerAddress: z.string().refine((value) => /^0x[a-fA-F0-9]{40}$/.test(value), { message: 'Adresse Ethereum non valide' }),
	rnbCode: z.string().min(2, { message: 'rnb non valide' }),
})
/////////////////////////////////////////////////////////
// CreateVoteDialog
/////////////////////////////////////////////////////////

type CreateVoteDialogProps = {}

const CreateCreateEstateDialog = ({}: CreateVoteDialogProps) => {
	const { data: users } = useGetManagersUsers()
	const queryClient = useQueryClient()
	const { data: hash, error, isPending, isSuccess, writeContract } = useWriteContract()

	const [open, setOpen] = useState(false)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { adminAddress: '', managerAddress: '', rnbCode: '' },
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { adminAddress, managerAddress, rnbCode } = data
		writeContract({
			address: addressEstateFactory,
			abi: EstateManagerFactoryArtifact.abi,
			functionName: 'createEstateManager',
			args: [adminAddress as `0x${string}`, managerAddress as `0x${string}`, rnbCode],
		})
	}

	const { data: dataReceipt } = useTransactionReceipt({ hash })

	useEffect(() => {
		async function handleDeploymentReceipt() {
			if (isSuccess && hash) {
				if (dataReceipt && dataReceipt.logs[0]?.address) {
					const { adminAddress, managerAddress, rnbCode } = form.getValues()

					const deployment = {
						id: dataReceipt.logs[0]?.address,
						adminId: users?.filter(({ walletAddress }) => walletAddress == adminAddress)?.[0]?.id,
						managerId: users?.filter(({ walletAddress }) => walletAddress == managerAddress)?.[0]?.id,
						rnbCode: rnbCode,
						factoryId: addressEstateFactory,
						blockHash: dataReceipt.blockHash,
						blockNumber: dataReceipt.blockNumber,
						transactionHash: hash,
						timestamp: new Date(),
					}

					await createEstateManager(deployment)

					form.reset()

					queryClient.invalidateQueries({ queryKey: ['getManagerEstate'] })

					toast({ title: 'Le batiment est ajouter', description: `code RNB : ${rnbCode}` })

					setOpen(false)
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
	}, [isSuccess, hash, form, dataReceipt, queryClient])

	useEffect(() => {
		if (error) {
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: error?.name ?? 'Undefined error',
			})
		}
	}, [error])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Ajouter un batiment</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Ajouter un nouveau batiment</DialogTitle>
					<DialogDescription>Entrer les détail du batiment</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-0'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<InputFORM
								formLabel={{ text: 'Code RNB du bâtiment' }}
								form={form}
								name='rnbCode'
								placeholder='Code RNB du bâtiment'
								className='w-full'
							/>
							<SelectFORM
								form={form}
								name='adminAddress'
								formLabel={{ text: 'Administrateur du bâtiment' }}
								placeholder='Administrateur du bâtiment'
								selectGroup={{
									groups: [{ values: formatForSelect(users) }],
								}}
							/>
							<SelectFORM
								formLabel={{ text: 'Manager du bâtiment' }}
								form={form}
								name='managerAddress'
								placeholder='Manager du bâtiment'
								selectGroup={{
									groups: [{ values: formatForSelect(users) }],
								}}
							/>

							<Button type='submit' className='w-full'>
								Ajouter
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default CreateCreateEstateDialog
