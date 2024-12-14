import React, { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import InputFORM from '@/components/shared/form/InputFORM'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { artifactVotes } from '@/constants/artifacts/votes'
import { LoadingOverlay } from '@/components/provider/blockchainProvider'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	description: z.string().min(5, {
		message: 'description must be at least 5 characters.',
	}),
	title: z.string().min(2, {
		message: 'title must be at least 2 characters.',
	}),
})

/////////////////////////////////////////////////////////
// COMPONENT
/////////////////////////////////////////////////////////

type AddProposalProps = { contractAddress: any; disabled: boolean; setOpenMenu: any }

const AddProposal = ({ contractAddress, disabled, setOpenMenu }: AddProposalProps) => {
	const [open, setOpen] = useState(false)

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
		defaultValues: { description: '', title: '' },
	})

	/////////////////////////////////////////////////////////
	// onSubmit
	/////////////////////////////////////////////////////////

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { title, description } = data
		writeContract({
			address: contractAddress,
			abi: artifactVotes.abi,
			functionName: 'addProposal',
			args: [description, title],
		})
	}

	/////////////////////////////////////////////////////////
	// isSuccess
	/////////////////////////////////////////////////////////

	useEffect(() => {
		if (isSuccess) {
			form.reset()
			toast({ title: 'Proposal Successful', description: 'The proposal was added successfully.' })
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

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenuItem onClick={handleOpenDialog} disabled={disabled}>
				Add proposal
			</DropdownMenuItem>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Add proposal</DialogTitle>
					<DialogDescription>Enter the details for the new proposal.</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<InputFORM form={form} name='title' placeholder='Title' className='w-full' />
							<InputFORM form={form} name='description' placeholder='Description' className='w-full' isTextArea />

							<Button type='submit' className='w-full'>
								Submit
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
			<LoadingOverlay isActive={isPending && !isSuccess && open} />
		</Dialog>
	)
}

export default AddProposal
