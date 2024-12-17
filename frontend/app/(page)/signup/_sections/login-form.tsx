'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createAccount } from '@/actions/createAccount'
import { Form } from '@/components/ui/form'
import InputFORM from '@/components/shared/form/InputFORM'
import SelectFORM from '@/components/shared/form/SelectFORM'
import ButtonWalletConnect from './walletConnect'
import { BlockchainContext, LoadingOverlay } from '@/components/provider/blockchainProvider'

const roles = [
	{ value: '1', text: 'Administrateur TIA' },
	{ value: '2', text: 'Gestionnaire' },
	{ value: '3', text: 'Prestataire' },
	{ value: '4', text: 'Lecteur' },
]

const roleDescriptions: Record<string, string> = {
	'1': 'Administrateur TIA : Responsable de la gestion globale du système.',
	'2': 'Gestionnaire : En charge de la gestion des réseaux et des biens immobiliers.',
	'3': 'Prestataire : Intervient sur les missions spécifiques liées aux biens.',
	'4': 'Lecteur : Dispose uniquement d’un accès en lecture pour consulter les données.',
}

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

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
	const { address: currentAccount, isConnected, isDisconnected } = useAccount()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { userAccount } = useContext(BlockchainContext)

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
		location.reload()
	}

	useEffect(() => {
		if (currentAccount) {
			form.setValue('walletAddress', currentAccount)
		}
	}, [currentAccount, form, isConnected])

	useEffect(() => {
		const account = form.getValues('accountRoleId')
		if (account) {
			const defaultLastName = roles?.filter(({ value }) => value == account)?.[0]?.text
			form.setValue('lastName', defaultLastName)
		}
	}, [form.getValues('accountRoleId')])

	return (
		<Form {...form}>
			<form className={cn('flex flex-col gap-6', className)} {...props} onSubmit={form.handleSubmit(onSubmit)}>
				<div className='flex flex-col items-center gap-2 text-center'>
					<h1 className='text-2xl font-bold'>Bienvenue sur TIA</h1>
					<p className='text-balance text-sm text-muted-foreground'>Le carnet de santé digital de vos bâtiments</p>
				</div>

				<div className='grid gap-6'>
					<div className='grid gap-2'>
						<InputFORM form={form} name='firstName' placeholder='Prénom' className='w-full' />
						<InputFORM form={form} name='lastName' placeholder='Nom' className='w-full hidden' disabled />
						<SelectFORM form={form} name='accountRoleId' placeholder='Type de compte' selectGroup={{ groups: [{ values: roles }] }} />

						{selectedRole && roleDescriptions[selectedRole] && (
							<p className='text-xs text-gray-500 mt-2 bg-sky-50 p-3 rounded-md'>{roleDescriptions[selectedRole]}</p>
						)}

						<InputFORM form={form} name='walletAddress' placeholder='Address wallet' className='w-full' disabled />

						<div className='mt-0'>
							<ButtonWalletConnect text='Connecté votre wallet' login={false} noAccount={false} />
						</div>
					</div>

					<Button type='submit' className='w-full' disabled={!isConnected}>
						Créer mon compte
					</Button>

					<div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
						<span className='relative z-10 bg-background px-2 text-muted-foreground'>Ou ce connecter</span>
					</div>

					<ButtonWalletConnect text='Connexion' login noAccount={!userAccount} />
				</div>
			</form>
			<LoadingOverlay isActive={isLoading} />
		</Form>
	)
}
