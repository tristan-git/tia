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
import { useGetManagersUsers } from '@/hooks/queries/manager/managerGetUsers'
import { EstateManagerFactoryArtifact } from '@/constants/artifacts/EstateManagerFactory'
import { addressEstateFactory } from '@/constants/contract'
import { createEstateManager } from '@/actions/manager/createEstateManager'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createNft } from '@/actions/manager/CreateNft'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	address: z.string().min(2, { message: 'Adresse invalide' }),
	town: z.string().min(2, { message: 'Ville invalide' }),
	file: z.any(),
})

/////////////////////////////////////////////////////////
// CreateCreateEstateNftDialog
/////////////////////////////////////////////////////////

type CreateCreateEstateNftDialogProps = {
	idEstate: any
	rnbCode: any
	tokenId: any
	disabled: any
}

const CreateCreateEstateNftDialog = ({ idEstate, rnbCode, tokenId, disabled }: CreateCreateEstateNftDialogProps) => {
	const [open, setOpen] = useState(false)

	const { address: currentAccount } = useAccount()
	const queryClient = useQueryClient()
	const { writeContract, isPending, isSuccess, data: hash, error } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })
	const [isProcessed, setIsProcessed] = useState(false)
	const [url, setUrl] = useState({})

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'all',
		resolver: zodResolver(FormSchema),
		defaultValues: { address: '', town: '' },
	})

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		try {
			const formData = new FormData()

			formData.append('idEstate', idEstate)
			formData.append('tokenId', tokenId)
			formData.append('rnbCode', rnbCode)

			for (const key in data as any) {
				if (key === 'file') formData.append(key, data[key][0])
				else formData.append(key, data[key])
			}

			const res = await fetch(`/api/nft/files`, {
				method: 'POST',
				body: formData,
			}).then((res) => res.json())

			if (res.success) {
				// Mint le NFT
				writeContract({
					address: idEstate as `0x${string}`,
					abi: EstateManagerArtifact.abi,
					functionName: 'mintNFT',
					args: [currentAccount as `0x${string}`, res.metadata.url],
					account: currentAccount,
				})

				setUrl({ metadata: res.metadata.url, blob: res.blob })
			}
		} catch (error) {
			toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' })
		}
	}

	useEffect(() => {
		async function handleWrite() {
			if (isSuccess && hash) {
				if (dataReceipt && dataReceipt.logs[0]?.address) {
					const { town, address } = form.getValues()

					const dataNft = {
						tokenId: tokenId,
						fromAddress: dataReceipt.from,
						estateManagerId: idEstate,
						metadataURI: url.metadata,
						transactionHash: dataReceipt.blockHash,
						town,
						address,
						img: url.blob.url,
						addressInterventionManager: dataReceipt.logs[0]?.address,
					}
					await createNft(dataNft)
					form.reset()
					queryClient.invalidateQueries({ queryKey: ['useGetManagerEstateNft'] })
					toast({ title: 'Bâtiment ajouter', description: 'Le bâtiment est bien ajouté' })
					setUrl({})
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
							<div className='grid w-full items-center gap-4'>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='address'>Adresse</Label>
									<Input id='address' placeholder='Adresse du bâtiment' {...form.register('address')} />
								</div>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='ville'>Ville</Label>
									<Input id='town' placeholder='Ville du bâtiment' {...form.register('town')} />
								</div>

								<input type='file' {...form.register('file')} />
							</div>

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

export default CreateCreateEstateNftDialog
