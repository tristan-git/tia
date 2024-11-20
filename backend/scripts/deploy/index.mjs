import { select } from '@inquirer/prompts'
import { spawn } from 'child_process'

// //////////////////////////////////////////////////////////////////////
// CONFIG ICI :
// //////////////////////////////////////////////////////////////////////

const generateChoice = (fileName) => ({
	name: `Module : ${fileName}`,
	value: `ignition/modules/${fileName}`,
})

const choices = [
	generateChoice('simpleStorage/SimpleStorageModule.js'), // = npx hardhat ignition deploy simpleStorage/SimpleStorageModule.js
	generateChoice('token/tokenModule.ts'), // = npx hardhat ignition deploy token/tokenModule.ts
	generateChoice('votingAlyra/votingModule.ts'),
	generateChoice('skale/mockContractModule.ts'),
]

// //////////////////////////////////////////////////////////////////////
//  deployModule()
// //////////////////////////////////////////////////////////////////////

async function deployModule(modulePath, network) {
	const args = ['hardhat', 'ignition', 'deploy', modulePath, '--network', network]

	const process = spawn('npx', args, { stdio: 'inherit' })

	return new Promise((resolve, reject) => {
		process.on('error', (error) => {
			console.error(`Erreur lors de l'exécution du déploiement : ${error.message}`)
			reject(error)
		})

		process.on('exit', (code) => {
			console.log(`Déploiement terminé avec le code : ${code}`)
			resolve(code)
		})
	})
}

// //////////////////////////////////////////////////////////////////////
//  chooseDeployment()
// //////////////////////////////////////////////////////////////////////

async function chooseDeployment() {
	let lastChoice = 'all' // Variable pour mémoriser le dernier choix

	while (true) {
		// Choix du réseau (local ou Sepolia)
		const chosenNetwork = await select({
			message: 'Sur quel réseau souhaitez-vous déployer ?',
			choices: [
				{ name: 'Localhost', value: 'localhost' },
				{ name: 'Sepolia', value: 'sepolia' },
				{ name: 'CANCEL', value: null },
			],
			default: 'localhost',
		})

		// Si l'utilisateur choisit d'annuler, sortir de la boucle
		if (chosenNetwork === null) break

		// Choix du module à déployer
		const chosenValue = await select({
			message: 'DEPLOYEMENT (IGNITION) OPTIONS : ',
			choices: [
				{ name: 'ALL MODULES CONTRACTS', value: 'all' },
				...choices.map(({ name, value }) => ({ name, value })),
				{ name: 'CANCEL', value: null },
			],
			pageSize: 6,
			default: lastChoice || null,
		})

		// Si l'utilisateur choisit d'annuler, sortir de la boucle
		if (chosenValue === null) break

		lastChoice = chosenValue

		if (chosenValue === 'all') {
			// Déploie tous les modules si l'utilisateur choisit "ALL MODULES CONTRACTS"
			for (const { value: modulePath } of choices) {
				console.log(`Déploiement du module : ${modulePath} sur ${chosenNetwork}`)
				await deployModule(modulePath, chosenNetwork) // Attendre que chaque module se déploie avant de passer au suivant
			}
		} else {
			// Déploie uniquement le module sélectionné
			console.log(`Déploiement du module : ${chosenValue} sur ${chosenNetwork}`)
			await deployModule(chosenValue, chosenNetwork)
		}
	}
}

// Appel de la fonction
chooseDeployment().catch(console.error)
