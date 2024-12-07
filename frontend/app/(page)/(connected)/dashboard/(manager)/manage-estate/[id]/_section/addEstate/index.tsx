'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAccount, useTransactionReceipt, useWriteContract } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AddFile from './addFile'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { useQueryClient } from '@tanstack/react-query'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	address: z.string().min(2, { message: 'Adresse invalide' }),
	town: z.string().min(2, { message: 'Ville invalide' }),
	file: z.any(),
})

type MyEstatesProps = {
	idEstate: string
	rnbCode: string
}

const AddEstate = ({ idEstate, rnbCode }: MyEstatesProps) => {
	const { address: currentAccount } = useAccount()
	const queryClient = useQueryClient()
	const { writeContract, isPending, isSuccess, data: hash, error } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })
	const [result, setResult] = useState('')

	console.log('error')
	console.log(error)

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'all',
		resolver: zodResolver(FormSchema),
		defaultValues: { address: '', town: '' },
	})

	/////////////////////////////////////////////////////////
	// onSubmit
	/////////////////////////////////////////////////////////

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		try {
			setResult('Sending....')
			const formData = new FormData()

			formData.append('idEstate', idEstate)
			formData.append('tokenId', '1')
			formData.append('rnbCode', rnbCode)

			for (const key in data) {
				if (key === 'file') {
					formData.append(key, data[key][0])
				} else {
					formData.append(key, data[key])
				}
			}

			const res = await fetch(`/api/nft/files`, {
				method: 'POST',
				body: formData,
			}).then((res) => res.json())

			if (res.success) {
				console.log('Success', res)

				// Mint le NFT
				writeContract({
					address: idEstate as `0x${string}`,
					abi: EstateManagerArtifact.abi,
					functionName: 'mintNFT',
					args: [currentAccount as `0x${string}`, res.metadata.url],
				})

				setResult(res.message)
			} else {
				console.log('Error', res)
				setResult(res.message)
			}

			toast({ title: 'NFT Minté', description: 'Le NFT a été créé avec succès.' })
		} catch (error) {
			console.error('Erreur lors du mint NFT:', error)
			toast({ variant: 'destructive', title: 'Erreur', description: 'Une erreur est survenue.' })
		}
	}

	/////////////////////////////////////////////////////////
	// comment
	/////////////////////////////////////////////////////////

	console.log('dataReceipt=====')
	console.log(dataReceipt)
	console.log(isSuccess)

	useEffect(() => {
		async function handleDeploymentReceipt() {
			if (isSuccess && hash) {
				console.log(dataReceipt)

				if (dataReceipt && dataReceipt.logs[0]?.address) {
					const deployment = {
						blockHash: dataReceipt.blockHash,
						blockNumber: dataReceipt.blockNumber,
						contractAddress: dataReceipt.logs[0]?.address,
						cumulativeGasUsed: dataReceipt.cumulativeGasUsed,
						effectiveGasPrice: dataReceipt.effectiveGasPrice,
						fromAddress: dataReceipt.from,
						gasUsed: dataReceipt.gasUsed,
						deploymentDate: new Date(),
					}

					console.log(deployment)

					// await saveDeployment(deployment)

					form.reset()

					// queryClient.invalidateQueries({ queryKey: ['voting_contracts'] })

					// toast({ title: 'Vote Successful', description: 'The vote was added successfully.' })

					// setOpen(false)
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
	}, [isSuccess, hash, form, dataReceipt])

	return (
		<Card className='w-[350px]'>
			<CardHeader>
				<CardTitle>Ajouter un bâtiment</CardTitle>
				<CardDescription>Un appartement ou autre...</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
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

					{/* <Image
						src='https://brown-broad-whitefish-602.mypinata.cloud/files/bafybeih4fh3soo2ugao2udduzr4uou4e2nb25zdekcnvpku5pzt6y7ozcu?X-Algorithm=PINATA1&X-Date=1733479735&X-Expires=30&X-Method=GET&X-Signature=4d6cc794f22d368e537d25f386e146de4c0deddea71aba9afc9d64443ffed55e'
						width={500}
						height={500}
						alt='Picture of the author'
					/> */}

					<Button type='submit' disabled={isPending}>
						{isPending ? 'En cours...' : 'Ajouter'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}

export default AddEstate
