'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useTransactionReceipt, useWriteContract } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	adminAddress: z.string().refine((value) => /^0x[a-fA-F0-9]{40}$/.test(value), { message: 'Adresse Ethereum non valide' }),
	managerAddress: z.string().refine((value) => /^0x[a-fA-F0-9]{40}$/.test(value), { message: 'Adresse Ethereum non valide' }),
	rnbCode: z.string().min(2, { message: 'rnb non valide' }),
})

type MyEstatesProps = { idEstate: string }

const AddEstate = ({ idEstate }: MyEstatesProps) => {
	const { address: currentAccount, status, isConnecting, isDisconnected, isReconnecting } = useAccount()
	const { data: hash, error, isPending, isSuccess, writeContract } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { adminAddress: '', managerAddress: '', rnbCode: '' },
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { adminAddress, managerAddress, rnbCode } = data

		writeContract({
			address: idEstate as `0x${string}`,
			abi: EstateManagerArtifact.abi,
			functionName: 'mintNFT',
			args: [currentAccount as `0x${string}`, BigInt(1), 'url'],
		})
    }
    

//     API Key: 9c94b8445030ab2193ca
// API Secret: b898a7ad09b1971b0c4a7432fbd7c76d3eb709c186b52c50094579ee6f6e8fb6
// JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhZjRhMzQ4Ny00NTBkLTRjZDMtYmIwYi05YzYzMzViNjQ4MTIiLCJlbWFpbCI6InRyaXN0YW4ubWFjaWFnQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5Yzk0Yjg0NDUwMzBhYjIxOTNjYSIsInNjb3BlZEtleVNlY3JldCI6ImI4OThhN2FkMDliMTk3MWIwYzRhNzQzMmZiZDdjNzZkM2ViNzA5YzE4NmI1MmM1MDA5NDU3OWVlNmY2ZThmYjYiLCJleHAiOjE3NjQ3ODM5MTh9.qmv-Xm1JQG0I2N28k3MyX43vROOa65yF9TNqTytRFCI

	return (
		<Card className='w-[350px]'>
			<CardHeader>
				<CardTitle>Ajouter un batiment</CardTitle>
				<CardDescription>Un appeartement ou autre chose...</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className='grid w-full items-center gap-4'>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='name'>Addresse</Label>
							<Input id='name' placeholder='Name of your project' />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='name'>Ville</Label>
							<Input id='name' placeholder='Name of your project' />
						</div>
						<div className='flex flex-col space-y-1.5'>
							<Label htmlFor='name'>Image</Label>
							<Input id='name' placeholder='Name of your project' />
						</div>
						{/* <div className='flex flex-col space-y-1.5'>
							<Label htmlFor='framework'>Framework</Label>
							<Select>
								<SelectTrigger id='framework'>
									<SelectValue placeholder='Select' />
								</SelectTrigger>
								<SelectContent position='popper'>
									<SelectItem value='next'>Next.js</SelectItem>
									<SelectItem value='sveltekit'>SvelteKit</SelectItem>
									<SelectItem value='astro'>Astro</SelectItem>
									<SelectItem value='nuxt'>Nuxt.js</SelectItem>
								</SelectContent>
							</Select>
						</div> */}
					</div>
				</form>
			</CardContent>
			<CardFooter className='flex justify-between'>
				<Button variant='outline'>Cancel</Button>
				<Button>Deploy</Button>
			</CardFooter>
		</Card>
	)
}

export default AddEstate
