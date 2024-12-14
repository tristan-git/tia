import React, { useEffect, useState } from 'react'

import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import InputFORM from '@/components/shared/form/InputFORM'
import { artifactVotes } from '@/constants/artifacts/votes'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { LoadingOverlay } from '@/components/provider/blockchainProvider'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	address: z.string().min(2, {
		message: 'address must be at least 2 characters.',
	}),
})

/////////////////////////////////////////////////////////
// COMPONENT
/////////////////////////////////////////////////////////

type AddVotersProps = { contractAddress: `0x${string}`; disabled: boolean; setOpenMenu: any }

const AddVoters = ({ contractAddress, disabled, setOpenMenu }: AddVotersProps) => {
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)

	const handleOpenDialog = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setOpen(true)
	}

	const { data: hash, error, writeContract } = useWriteContract()
	const { isLoading, isSuccess, isPending, error: errorConfirmation } = useWaitForTransactionReceipt({ hash })

	/////////////////////////////////////////////////////////
	// useForm
	/////////////////////////////////////////////////////////

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			address: '',
		},
	})

	/////////////////////////////////////////////////////////
	// onSubmit
	/////////////////////////////////////////////////////////

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { address } = data

		writeContract({
			address: contractAddress,
			abi: artifactVotes.abi,
			functionName: 'addVoter',
			args: [address],
		})
	}

	/////////////////////////////////////////////////////////
	// isSuccess
	/////////////////////////////////////////////////////////

	useEffect(() => {
		async function handleDeploymentReceipt() {
			form.reset()
			toast({ title: 'Transaction Successful', description: 'The voter was added successfully.' })
			setOpen(false)
			setOpenMenu(false)
		}
		if (isSuccess) {
			handleDeploymentReceipt()
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
				Add voter
			</DropdownMenuItem>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Add voter</DialogTitle>
					<DialogDescription>Enter the details for the new voter.</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
		{			<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<InputFORM form={form} name='address' placeholder='Enter address' className='w-full' />
							<Button type='submit' className='w-full'>
								Submit
							</Button>
						</form>
					</Form>}
				</div>
			</DialogContent>
			<LoadingOverlay isActive={isPending && !isSuccess && open} />
		</Dialog>
	)
}

export default AddVoters
