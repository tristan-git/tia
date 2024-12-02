'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import InputFORM from '@/components/shared/form/InputFORM'
import ButtonWalletConnect from './walletConnect'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import SelectFORM from '@/components/shared/form/SelectFORM'
import { createAccount } from '@/actions/createAccount'

/////////////////////////////////////////////////////////
// ZOD SCHEMA
/////////////////////////////////////////////////////////

const FormSchema = z.object({
	firstName: z.string().min(2, {
		message: 'first name title must be at least 2 characters.',
	}),
	lastName: z.string().min(2, {
		message: 'last name title must be at least 2 characters.',
	}),
	walletAddress: z.string().min(42, {
		message: 'Not valid address',
	}),
	accountRoleId: z.string().min(1),
})

/////////////////////////////////////////////////////////
// COMPONENT
/////////////////////////////////////////////////////////

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const { address: currentAccount, status, isConnecting, isDisconnected, isReconnecting } = useAccount()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { firstName: '', lastName: '', walletAddress: currentAccount },
	})

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setIsLoading(true)
		const { firstName, lastName, walletAddress, accountRoleId } = data
		await createAccount({ firstName, lastName, walletAddress, accountRoleId })
		setIsLoading(false)
	}

	useEffect(() => {
		if (currentAccount) {
			form.setValue('walletAddress', currentAccount)
		}
	}, [currentAccount, form])

	return (
		<div className={cn('grid gap-6', className)} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
					<InputFORM form={form} name='firstName' placeholder='Nom' className='w-full' />
					<InputFORM form={form} name='lastName' placeholder='Prénom' className='w-full' />
					<SelectFORM
						form={form}
						name='accountRoleId'
						placeholder='Type de compte'
						selectGroup={{
							groups: [
								{
									values: [
										{ value: '2', text: 'Manager de bien' },
										{ value: '3', text: 'Prestataire de service' },
										{ value: '4', text: 'Assurance' },
									],
								},
							],
						}}
					/>

					{currentAccount ? (
						<InputFORM form={form} name='walletAddress' placeholder='wallet' className='w-full' disabled />
					) : (
						<ButtonWalletConnect />
					)}

					{currentAccount && (
						<Button type='submit' className='w-full'>
							{isLoading ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : <></>}Créer mon compte
						</Button>
					)}
				</form>
			</Form>
		</div>
	)
}
