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

const roleDescriptions: Record<string, string> = {
	'1': 'Administrateur TIA : Responsable de la gestion globale du système.',
	'2': 'Gestionnaire : En charge de la gestion des réseaux et des biens immobiliers.',
	'3': 'Prestataire : Intervient sur les missions spécifiques liées aux biens.',
	'4': 'Lecteur : Dispose uniquement d’un accès en lecture pour consulter les données.',
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const { address: currentAccount } = useAccount()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { firstName: '', lastName: '', walletAddress: currentAccount },
	})

	const selectedRole = form.watch('accountRoleId') // Surveille la valeur du rôle

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
										{ value: '1', text: 'Administrateur TIA' },
										{ value: '2', text: 'Gestionnaire' },
										{ value: '3', text: 'Prestataire' },
										{ value: '4', text: 'Lecteur' },
									],
								},
							],
						}}
					/>

					{/* Texte d'informations sur le rôle sélectionné */}
					{selectedRole && roleDescriptions[selectedRole] && (
						<p className='text-xs text-gray-500 mt-2 bg-sky-50 p-3 rounded-md'>{roleDescriptions[selectedRole]}</p>
					)}

					{currentAccount ? (
						<InputFORM form={form} name='walletAddress' placeholder='wallet' className='w-full' disabled />
					) : (
						<ButtonWalletConnect text='Connecter votre Wallet' />
					)}

					{currentAccount && (
						<Button type='submit' variant='outline' className='w-full'>
							{isLoading ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : <></>}Créer mon compte
						</Button>
					)}
				</form>
			</Form>
			<ButtonWalletConnect text='Login' />
		</div>
	)
}
