'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useTransactionReceipt, useWriteContract } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { createNft } from '@/actions/manager/CreateNft'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Form } from '@/components/ui/form'
import { FileIcon } from '@radix-ui/react-icons'
import SelectFORM from '@/components/shared/form/SelectFORM'
import { LoadingOverlay } from '@/components/provider/blockchainProvider'

const groups = [
	{
		values: [
			{ value: 'paris', text: 'Paris' },
			{ value: 'lyon', text: 'Lyon' },
			{ value: 'marseille', text: 'Marseille' },
			{ value: 'toulouse', text: 'Toulouse' },
			{ value: 'bordeaux', text: 'Bordeaux' },
			{ value: 'nantes', text: 'Nantes' },
			{ value: 'strasbourg', text: 'Strasbourg' },
			{ value: 'nice', text: 'Nice' },
			{ value: 'lille', text: 'Lille' },
			{ value: 'rennes', text: 'Rennes' },
			{ value: 'angers', text: 'Angers' },
			{ value: 'reims', text: 'Reims' },
			{ value: 'caen', text: 'Caen' },
			{ value: 'tours', text: 'Tours' },
			{ value: 'dijon', text: 'Dijon' },
			{ value: 'grenoble', text: 'Grenoble' },
			{ value: 'montpellier', text: 'Montpellier' },
			{ value: 'clermont-ferrand', text: 'Clermont-Ferrand' },
			{ value: 'avignon', text: 'Avignon' },
			{ value: 'saint-etienne', text: 'Saint-Étienne' },
			{ value: 'poitiers', text: 'Poitiers' },
			{ value: 'metz', text: 'Metz' },
			{ value: 'limoges', text: 'Limoges' },
			{ value: 'orléans', text: 'Orléans' },
			{ value: 'besançon', text: 'Besançon' },
			{ value: 'amiens', text: 'Amiens' },
			{ value: 'perpignan', text: 'Perpignan' },
			{ value: 'troyes', text: 'Troyes' },
			{ value: 'brest', text: 'Brest' },
			{ value: 'le-havre', text: 'Le Havre' },
			{ value: 'pau', text: 'Pau' },
			{ value: 'nancy', text: 'Nancy' },
			{ value: 'la-rochelle', text: 'La Rochelle' },
			{ value: 'rouen', text: 'Rouen' },
			{ value: 'saint-malo', text: 'Saint-Malo' },
			{ value: 'ajaccio', text: 'Ajaccio' },
			{ value: 'bastia', text: 'Bastia' },
			{ value: 'annecy', text: 'Annecy' },
			{ value: 'bayonne', text: 'Bayonne' },
			{ value: 'valence', text: 'Valence' },
			{ value: 'tarbes', text: 'Tarbes' },
			{ value: 'colmar', text: 'Colmar' },
			{ value: 'niort', text: 'Niort' },
			{ value: 'chambéry', text: 'Chambéry' },
			{ value: 'albi', text: 'Albi' },
			{ value: 'arles', text: 'Arles' },
			{ value: 'sète', text: 'Sète' },
			{ value: 'cholet', text: 'Cholet' },
			{ value: 'mulhouse', text: 'Mulhouse' },
			{ value: 'chartres', text: 'Chartres' },
			{ value: 'verdun', text: 'Verdun' },
		],
	},
]

const groupsAddress = [
	{
		values: [
			{ value: '12 Rue Floral', text: '12 Rue Floral' },
			{ value: '21 Boulevard Lyonnais', text: '21 Boulevard Lyonnais' },
			{ value: '8 Place Marseillaise', text: '8 Place Marseillaise' },
			{ value: '34 Avenue Toulousaine', text: '34 Avenue Toulousaine' },
			{ value: '15 Rue Viticole', text: '15 Rue Viticole' },
			{ value: 'Centre Commercial Les Halles', text: 'Centre Commercial Les Halles' },
			{ value: 'Tour Europe', text: 'Tour Europe' },
			{ value: 'Promenade des Anglais', text: 'Promenade des Anglais' },
			{ value: '10 Rue des Artisans', text: '10 Rue des Artisans' },
			{ value: 'Zone Commerciale Rennes Sud', text: 'Zone Commerciale Rennes Sud' },
			{ value: 'Zone Industrielle', text: 'Zone Industrielle' },
			{ value: 'Site Logistique', text: 'Site Logistique' },
			{ value: 'Parc Technologique', text: 'Parc Technologique' },
			{ value: "Zone d'Activité", text: "Zone d'Activité" },
			{ value: 'Usine Mustard', text: 'Usine Mustard' },
			{ value: '50 Avenue Champs Elysées', text: '50 Avenue Champs Elysées' },
			{ value: '33 Rue Victor Hugo', text: '33 Rue Victor Hugo' },
			{ value: '10 Rue de la République', text: '10 Rue de la République' },
			{ value: '75 Rue Saint Ferreol', text: '75 Rue Saint Ferreol' },
			{ value: '5 Boulevard Haussmann', text: '5 Boulevard Haussmann' },
			{ value: '13 Quai des Chartrons', text: '13 Quai des Chartrons' },
			{ value: '25 Boulevard des Pyrénées', text: '25 Boulevard des Pyrénées' },
			{ value: '50 Rue d’Albi', text: '50 Rue d’Albi' },
			{ value: '19 Rue Emile Zola', text: '19 Rue Emile Zola' },
			{ value: '45 Allée Jules Guesde', text: '45 Allée Jules Guesde' },
			{ value: '22 Place Stanislas', text: '22 Place Stanislas' },
			{ value: '18 Boulevard Gambetta', text: '18 Boulevard Gambetta' },
			{ value: '6 Rue de la Monnaie', text: '6 Rue de la Monnaie' },
			{ value: '40 Rue Saint Pierre', text: '40 Rue Saint Pierre' },
			{ value: '12 Allée du Parc', text: '12 Allée du Parc' },
			{ value: '32 Rue de Metz', text: '32 Rue de Metz' },
			{ value: '14 Boulevard Carnot', text: '14 Boulevard Carnot' },
			{ value: '9 Rue de la Liberté', text: '9 Rue de la Liberté' },
			{ value: '20 Cours Mirabeau', text: '20 Cours Mirabeau' },
			{ value: '8 Place du Capitole', text: '8 Place du Capitole' },
		],
	},
]

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

type CreateCreateEstateNftDialogProps = {
	idEstate: any
	rnbCode: any
	tokenId: any
	disabled: any
}

const CreateCreateEstateNftDialog = ({ idEstate, rnbCode, tokenId, disabled }: CreateCreateEstateNftDialogProps) => {
	const [open, setOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { address: currentAccount } = useAccount()
	const queryClient = useQueryClient()
	const { writeContract, isPending, isSuccess, data: hash, error, } = useWriteContract()
	const { data: dataReceipt } = useTransactionReceipt({ hash })
	const [isProcessed, setIsProcessed] = useState(false)
	const [url, setUrl] = useState({})

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'all',
		resolver: zodResolver(FormSchema),
		defaultValues: { address: '', town: '' },
	})

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		try {
			setIsSubmitting(true)
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
			form.reset()
			setIsSubmitting(false)
			setOpen(false)
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
					setIsSubmitting(false)
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
			form.reset()
			setIsSubmitting(false)
			setOpen(false)
		})
	}, [isSuccess, hash, form, dataReceipt])

	return (
		<Dialog open={open} onOpenChange={(newState) => !isSubmitting && setOpen(newState)}>
			<DialogTrigger asChild disabled={disabled}>
				<Button>Ajouter un batiment</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Ajouter un nouveau batiment</DialogTitle>
					<DialogDescription>Entrer les détail du batiment</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-0'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<div className='grid w-full items-center gap-4'>
								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='ville'>Ville</Label>
									<SelectFORM form={form} name='town' placeholder='Selectionner une ville' selectGroup={{ groups }} />
								</div>

								<div className='flex flex-col space-y-1.5'>
									<Label htmlFor='address'>Adresse</Label>
									<SelectFORM form={form} name='address' placeholder='Selectionner une addresse' selectGroup={{ groups: groupsAddress }} />
								</div>

								{!form.getValues().file?.[0]?.name && (
									<div
										className='border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center cursor-pointer'
										onClick={() => document.getElementById('file')?.click()}
									>
										<FileIcon className='w-12 h-12' />
										<span className='text-sm font-medium text-gray-500'>Cliquer pour importer un la photos</span>
										<span className='text-xs text-gray-500'>image uniquement</span>

										<Input id='file' type='file' placeholder='File' {...form.register('file')} className='hidden' />
									</div>
								)}
							</div>

							{form.getValues().file?.[0]?.name && (
								<div className='text-xs bg-blue-50 rounded-sm p-2'>{form.getValues().file?.[0]?.name}</div>
							)}

							<Button type='submit' className='w-full' disabled={isSubmitting || !form.getValues().file?.[0]?.name}>
								{isSubmitting ? 'En cours...' : 'Ajouter'}
							</Button>
						</form>
					</Form>
				</div>
			</DialogContent>
			<LoadingOverlay isActive={isSubmitting && open} />
		</Dialog>
	)
}

export default CreateCreateEstateNftDialog
