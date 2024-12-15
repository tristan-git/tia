'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'

const GuideModal = () => {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		// Vérifier si l'utilisateur a déjà vu la modale
		const hasVisited = localStorage.getItem('hasSeenGuideModal')
		if (!hasVisited) {
			setOpen(true) // Ouvre la modale automatiquement
			localStorage.setItem('hasSeenGuideModal', 'true') // Enregistre que la modale a été vue
		}
	}, [])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>
					<QuestionMarkCircledIcon className=' h-4 w-4' />
					Afficher le guide
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-[800px]'>
				<DialogHeader>
					<DialogTitle>Guide d'utilisation</DialogTitle>
					<DialogDescription>Suivez ces étapes pour comprendre et configurer correctement votre application.</DialogDescription>
				</DialogHeader>

				<ScrollArea className='max-h-[500px] text-sm'>
					<div className='space-y-4'>
						<section className='bg-sky-100 dark:bg-gray-800 rounded-sm p-4'>
							<h2 className='text-lg font-semibold'>À propos de l'application TIA</h2>
							<p className='mb-2 text-sm'>
								L'application TIA offre une solution innovante pour la gestion des réseaux immobiliers, permettant de centraliser et de
								digitaliser le "carnet de santé" des bâtiments. Avec TIA, vous pouvez regrouper un ensemble de biens immobiliers sous un
								code unique appelé <strong>RNB</strong> (<em>Réseau Numérique Bâtiment</em>). Ce code RNB représente une identité collective
								pour les propriétés d'un même bâtiment. Par exemple, un immeuble avec plusieurs propriétaires partage un seul code RNB,
								offrant une vue unifiée et simplifiée de la gestion du bien.
							</p>
							<p className='mb-2'>
								L'application repose sur des <strong>smart contracts</strong> pour créer et gérer un réseau immobilier sous forme d'une{' '}
								<strong>collection de NFTs</strong>. Chaque NFT représente une propriété spécifique au sein du réseau. À ce smart contract,
								vous pouvez assigner différents modules qui ajoutent des fonctionnalités personnalisées.
							</p>
							<p className='mb-2'>
								Dans le cadre de ce site, l'accent est mis sur le <strong>module d'intervention</strong>, qui est lié à chaque NFT
								(propriété). Ce module permet :
							</p>
							<ul className='list-disc ml-4 mb-2'>
								<li>
									<strong>D'ajouter des interventions :</strong> Suivre et documenter toutes les actions réalisées sur une propriété, comme
									des réparations ou des inspections.
								</li>
								<li>
									<strong>De gérer des documents associés :</strong> Les documents sont sécurisés grâce à leur hachage (*hash*), stocké
									directement sur le contrat du module d'intervention. Cela garantit leur authenticité et leur intégrité dans le temps.
								</li>
							</ul>
							<p>
								Grâce à cette approche, TIA garantit une transparence totale et une gestion efficace des biens immobiliers, tout en
								exploitant la puissance de la blockchain pour assurer la sécurité et la traçabilité des données.
							</p>
						</section>

						<section className='bg-red-100 dark:bg-red-800 rounded-sm p-4'>
							Lorsque vous utilisez MetaMask, il est possible que le message “Une transaction est déjà en cours” s’affiche. Cela signifie
							que votre transaction précédente est encore en cours de traitement. Il est essentiel de patienter jusqu’à ce que cette
							transaction soit confirmée avant d’en initier une nouvelle. Tenter de valider une nouvelle transaction pendant qu’une autre
							est en attente pourrait entraîner des erreurs ou des rejets. Prenez votre temps et assurez-vous que chaque transaction est
							finalisée avant de passer à la suivante. 😊
						</section>

						<section className='bg-sky-100 dark:bg-gray-800 rounded-sm p-4'>
							<strong>Important :</strong> Lors de la création de chaque compte, vous recevrez automatiquement une allocation de{' '}
							<strong>SkFuel</strong>, utilisée pour payer les frais de gaz sur la blockchain <strong>Skale</strong>.
						</section>

						<section>
							<h2 className='text-lg font-semibold'>Étape 1 : Créer les comptes</h2>

							<p>
								Créez 4 comptes en utilisant des portefeuilles (wallets) différents. Chaque compte doit correspondre à un rôle spécifique :
							</p>
							<ul className='list-disc ml-4'>
								<li>1 Administrateur</li>
								<li>1 Gestionnaire</li>
								<li>1 Prestataire</li>
								<li>1 Lecteur</li>
							</ul>
						</section>

						<section>
							<h2 className='text-lg font-semibold'>Étape 2 : Se connecter en tant que gestionnaire</h2>
							<p>
								Connectez-vous avec le compte <strong>gestionnaire</strong>. Accédez à la page <em>Réseaux immobiliers</em>. Créez un réseau
								immobilier en sélectionnant un administrateur (choisissez l'administrateur précédemment créé dans le champ déroulant).
							</p>
						</section>

						<section>
							<h2 className='text-lg font-semibold'>Étape 3 : Autoriser le module intervention</h2>
							<p>
								Switcher sur le compte <strong>administrateur</strong>, accédez à la page <em>Autorisation module</em> et assignez le module{' '}
								<strong>Intervention</strong>.
							</p>
						</section>

						<section>
							<h2 className='text-lg font-semibold'>Étape 4 : Accéder au réseau</h2>
							<p>
								Retournez sur le compte <strong>gestionnaire</strong>, accédez à la page <em>Réseaux immobiliers</em> et cliquez sur{' '}
								<strong>Voir</strong> dans la ligne du tableau correspondant à votre réseau pour y accéder.
							</p>
						</section>

						<section>
							<h2 className='text-lg font-semibold'>Étape 5 : Créer un bâtiment</h2>
							<p>Ajoutez un bâtiment dans votre réseau immobilier.</p>
						</section>

						<section>
							<h2 className='text-lg font-semibold'>Étape 6 : Attribuer des permissions au prestataire</h2>
							<p>
								Cliquez sur les <strong>"..."</strong> en fin de ligne du tableau du bâtiment, puis sélectionnez{' '}
								<em>Permissions interventions</em>. Ajoutez le compte <strong>prestataire</strong> que vous avez créé auparavant.
							</p>
						</section>

						<section>
							<h2 className='text-lg font-semibold'>Étape 7 : Créer une intervention</h2>
							<p>
								Switcher sur le compte <strong>prestataire</strong>. Accédez aux interventions du bâtiment et créez une intervention. Vous
								pouvez également ajouter des documents à cette intervention.
							</p>
						</section>

						<section>
							<h2 className='text-lg font-semibold'>Étape 8 : Validation et partage des documents</h2>
							<p>
								Switcher sur le compte <strong>gestionnaire</strong>. Validez l'intervention et partagez des droits en lecture sur les
								documents de l'intervention.
							</p>
						</section>

						<section>
							<h2 className='text-lg font-semibold'>Étape 9 : Consultation en tant que lecteur</h2>
							<p>
								Switcher sur le compte <strong>lecteur</strong>. Accédez aux documents pour lesquels vous avez reçu des droits en lecture.
							</p>
						</section>
					</div>
				</ScrollArea>

				<DialogFooter>
					<Button variant='outline' onClick={() => setOpen(false)}>
						Fermer
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default GuideModal
