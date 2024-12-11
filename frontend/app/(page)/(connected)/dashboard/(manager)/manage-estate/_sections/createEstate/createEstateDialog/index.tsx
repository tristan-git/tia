'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useTransactionReceipt, useWriteContract } from 'wagmi'
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
import { useGetManagersUsers } from '@/hooks/queries/users/managerGetUsers'
import { EstateManagerFactoryArtifact } from '@/constants/artifacts/EstateManagerFactory'
import { addressEstateFactory } from '@/constants/contract'
import { createEstateManager } from '@/actions/manager/createEstateManager'
import { Label } from '@/components/ui/label'
import { useGetAllUsers } from '@/hooks/queries/users/useGetAllUsers'

const formatForSelect = (users: any) =>
	users?.map((user: any) => ({
		value: user.walletAddress,
		text: `${user.firstName} ${user.lastName}`,
	}))

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	// adminAddress: z.string().refine((value) => /^0x[a-fA-F0-9]{40}$/.test(value), { message: 'Adresse Ethereum non valide' }),
	// managerAddress: z.string().refine((value) => /^0x[a-fA-F0-9]{40}$/.test(value), { message: 'Adresse Ethereum non valide' }),
	rnbCode: z.string().min(2, { message: 'rnb non valide' }),
	networkTypes: z.string().min(2, { message: 'requis' }),
})
/////////////////////////////////////////////////////////
// CreateVoteDialog
/////////////////////////////////////////////////////////

type CreateVoteDialogProps = {}

const CreateCreateEstateDialog = ({}: CreateVoteDialogProps) => {
	const { data: users } = useGetAllUsers()
	const { address } = useAccount()
	const queryClient = useQueryClient()
	const { data: hash, error, isPending, isSuccess, writeContract } = useWriteContract()

	const [open, setOpen] = useState(false)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { rnbCode: '' },
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		//const { adminAddress, managerAddress, rnbCode } = data
		const { rnbCode } = data
		writeContract({
			address: addressEstateFactory,
			abi: EstateManagerFactoryArtifact.abi,
			functionName: 'createEstateManager',
			args: ['0x734cEf8774dEB4FD18DFe57f010b842941012BBB' as `0x${string}`, address as `0x${string}`, rnbCode],
		})
	}

	const { data: dataReceipt } = useTransactionReceipt({ hash })

	useEffect(() => {
		async function handleDeploymentReceipt() {
			if (isSuccess && hash) {
				if (dataReceipt && dataReceipt.logs[0]?.address) {
					// const { adminAddress, managerAddress, rnbCode } = form.getValues()
					const { rnbCode, networkTypes } = form.getValues()

					const deployment = {
						id: dataReceipt.logs[0]?.address,
						managerId: users?.filter(({ walletAddress }) => walletAddress == address)?.[0]?.id,
						adminId: users?.filter(({ walletAddress }) => walletAddress == '0x734cEf8774dEB4FD18DFe57f010b842941012BBB')?.[0]?.id,
						rnbCode: rnbCode,
						factoryId: addressEstateFactory,
						blockHash: dataReceipt.blockHash,
						blockNumber: dataReceipt.blockNumber,
						transactionHash: hash,
						timestamp: new Date(),
						networkTypes,
					}

					await createEstateManager(deployment)

					form.reset()

					queryClient.invalidateQueries({ queryKey: ['getManagerEstate'] })

					toast({ title: 'Le réseau est ajouter', description: `code RNB : ${rnbCode}, type : ${networkTypes}` })

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
				<Button>Créer un réseau immobilier</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Créer un nouveau Réseau Immobilier</DialogTitle>
					<DialogDescription>Entrez les détails du réseau immobilier</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-0'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<InputFORM formLabel={{ text: 'Code RNB' }} form={form} name='rnbCode' placeholder='Code RNB' className='w-full' />

							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='ville'>Type de réseau immobilier</Label>
								<SelectFORM
									form={form}
									name='networkTypes'
									placeholder='Sélectionnez un type de réseau'
									selectGroup={{
										groups: [
											{
												values: [
													{ value: 'immeuble', text: 'Immeuble' },
													{ value: 'Lotissement', text: 'Lotissement' },
													{ value: 'zone_commerciale', text: 'Zone Commerciale' },
												],
											},
										],
									}}
								/>
							</div>

							{/* <SelectFORM
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
							/> */}

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
