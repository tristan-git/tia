'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useTransactionReceipt, useWriteContract } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import InputFORM from '@/components/shared/form/InputFORM'
import SelectFORM from '@/components/shared/form/SelectFORM'
import { useGetManagersUsers } from '@/hooks/queries/users/managerGetUsers'
import { EstateManagerFactoryArtifact } from '@/constants/artifacts/EstateManagerFactory'
import { addressEstateFactory } from '@/constants/contract'
import { createEstateManager } from '@/actions/manager/createEstateManager'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createNft } from '@/actions/manager/CreateNft'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingOverlay } from '@/components/provider/blockchainProvider'

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

type CreatePermissionDialogProps = { idEstate; rnbCode; tokenId }

const CreatePermissionDialog = ({ idEstate, rnbCode, tokenId }: CreatePermissionDialogProps) => {
	const [open, setOpen] = useState(false)

	const { address: currentAccount } = useAccount()
	const queryClient = useQueryClient()
	const { writeContract, isPending, isSuccess, data: hash, error } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })
	const [url, setUrl] = useState({})

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'all',
		resolver: zodResolver(FormSchema),
		defaultValues: { address: '', town: '' },
	})

	const handleOpenDialog = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setOpen(true)
	}

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
					queryClient.invalidateQueries()
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
			<DialogTrigger asChild>
				<Button variant='outline'>Permission</Button>
			</DialogTrigger>
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
			<LoadingOverlay isActive={isPending && !isSuccess && open} />
		</Dialog>
	)
}

export default CreatePermissionDialog
