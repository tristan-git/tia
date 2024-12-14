import React, { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useVotingProposal } from '@/hooks/queries/votes/useVotingProposal'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { artifactVotes } from '@/constants/artifacts/votes'
import { checksumAddress } from 'viem'
import { LoadingOverlay } from '@/components/provider/blockchainProvider'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	vote: z.string(),
})

/////////////////////////////////////////////////////////
// COMPONENT
/////////////////////////////////////////////////////////

type VoteProps = { contractAddress: any; disabled: boolean; dataVote: any; setOpenMenu: any }

const Vote = ({ contractAddress, disabled, dataVote, setOpenMenu }: VoteProps) => {
	const { address: currentAccount } = useAccount()
	const [open, setOpen] = useState(false)
	const [proposals, setProposals] = useState([])

	const handleOpenDialog = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setOpen(true)
	}

	const { data: hash, error, isPending, writeContract } = useWriteContract()
	const { isLoading, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({ hash })

	/////////////////////////////////////////////////////////
	// useForm
	/////////////////////////////////////////////////////////

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { vote: '' },
	})

	/////////////////////////////////////////////////////////
	// onSubmit
	/////////////////////////////////////////////////////////

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { vote } = data
		writeContract({
			address: contractAddress,
			abi: artifactVotes.abi,
			functionName: 'setVote',
			args: [parseInt(vote)],
		})
	}

	/////////////////////////////////////////////////////////
	// isSuccess
	/////////////////////////////////////////////////////////

	useEffect(() => {
		if (isSuccess) {
			form.reset()
			toast({ title: 'Vote Successful', description: 'The vote was added successfully.' })
			setOpen(false)
			setOpenMenu(false)
		}
		if (error) {
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: error?.name ?? 'Undefined error',
			})
		}
	}, [isSuccess, form, setOpen, error])

	/////////////////////////////////////////////////////////
	// comment
	/////////////////////////////////////////////////////////

	useEffect(() => {
		const fetchProposal = async () => {
			const { result } = await useVotingProposal({
				proposalIds: dataVote?.proposals?.map(({ id }) => parseInt(id)),
				address: contractAddress,
				currentAccount,
			})

			setProposals(result)
		}

		!disabled && fetchProposal()
	}, [currentAccount, disabled])

	const currentUserVote = dataVote?.votes?.filter(({ voterId }) => checksumAddress(voterId) == checksumAddress(currentAccount))

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenuItem onClick={handleOpenDialog} disabled={disabled}>
				Vote
			</DropdownMenuItem>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Vote</DialogTitle>
					<DialogDescription>Enter the Vote</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<FormField
								control={form.control}
								name='vote'
								render={({ field, fieldState }) => (
									<FormItem className=''>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={currentUserVote?.length ? currentUserVote[0]?.proposalId : field.value}
												className=''
												disabled={currentUserVote?.length}
											>
												{proposals?.map(({ title, description }, i) => (
													<FormItem className='flex items-center space-x-3 space-y-0 ' key={title + i}>
														<Label
															htmlFor={`r${i}`}
															className={`flex space-y-0 space-x-2 rounded-md border p-4 w-full  ${
																field.value == (i + 1).toString() ? ' bg-primary/5' : ''
															}`}
														>
															<RadioGroupItem value={(i + 1).toString()} id={`r${i}`} />
															<div className='font-bold'> {title}</div>
															<div className='text-xs text-zinc-500'>{description}</div>
														</Label>
													</FormItem>
												))}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type='submit' className='w-full' disabled={currentUserVote?.length}>
								{currentUserVote?.length ? 'Already vote' : 'Submit'}
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
			<LoadingOverlay isActive={isPending && !isSuccess && open} />
		</Dialog>
	)
}

export default Vote
