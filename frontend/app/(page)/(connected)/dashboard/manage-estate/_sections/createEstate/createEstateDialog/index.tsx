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
import { saveDeployment } from '@/actions/saveContract'
import { artifactVotesFactory } from '@/constants/artifacts/votesFactory'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	votingTitle: z.string().min(2, {
		message: 'Voting title must be at least 2 characters.',
	}),
})

/////////////////////////////////////////////////////////
// CreateVoteDialog
/////////////////////////////////////////////////////////

type CreateVoteDialogProps = {}

const CreateCreateEstateDialog = ({}: CreateVoteDialogProps) => {
	const queryClient = useQueryClient()
	const { data: hash, error, isPending, isSuccess, writeContract } = useWriteContract()

	const [open, setOpen] = useState(false)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { votingTitle: '' },
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { votingTitle } = data

		writeContract({
			address: '0x9eEcA09989c7d0dd90eCDDE48713DF42BBBaD635',
			abi: artifactVotesFactory.abi,
			functionName: 'createVotingContract',
			args: [votingTitle],
		})
	}

	const { data: dataReceipt } = useTransactionReceipt({ hash })

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

					await saveDeployment(deployment)

					await new Promise((resolve) => setTimeout(resolve, 2000))

					form.reset()

					await queryClient.invalidateQueries({ queryKey: ['voting_contracts'] })

					toast({ title: 'Vote Successful', description: 'The vote was added successfully.' })

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
	}, [isSuccess, hash, form, dataReceipt])

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
				<Button>Create vote</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Create new vote</DialogTitle>
					<DialogDescription>Enter the title of the new vote.</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-0'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<InputFORM form={form} name='votingTitle' placeholder='Subject vote' className='w-full' />

							<Button type='submit' className='w-full'>
								Submit
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default CreateCreateEstateDialog
