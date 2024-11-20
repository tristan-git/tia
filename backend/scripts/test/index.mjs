import { select } from '@inquirer/prompts'
import { spawn } from 'child_process'

// https://www.npmjs.com/package/@inquirer/prompts

// //////////////////////////////////////////////////////////////////////
// CONFIG ICI :
// //////////////////////////////////////////////////////////////////////

const generateChoice = (fileName) => ({
	name: `Test : ${fileName}`,
	value: `test/${fileName}`,
})

const choices = [
	// generateChoice('Lock.ts'), // = npx hardhat test Lock.ts
	// generateChoice('Lock2.ts'), // = npx hardhat test Lock2.ts
	// generateChoice('toto/totoTest.ts'), // = npx hardhat test toto/totoTest.ts
	generateChoice('tokenERC20/TokenKSD.ts'),
	generateChoice('votingAlyra/Voting.ts'),
	generateChoice('security/security.test.ts'),
	// generateChoice("Lock2"),
	// generateChoice("Lock2"),
	// generateChoice("Lock2"),
	// generateChoice("Lock2"),
]

// //////////////////////////////////////////////////////////////////////
//  choose Tests
// //////////////////////////////////////////////////////////////////////

async function chooseTest() {
	let lastChoice = 'all' // Variable pour mémoriser le dernier choix

	while (true) {
		const chosenValue = await select({
			message: "Quel test souhaitez-vous lancer ? (Utilisez 'Quitter' pour quitter)",
			choices: [
				{ name: 'ALL TESTS', value: 'all' },
				...choices.map(({ name, value }) => ({ name, value })),
				{ name: 'CANCEL', value: null },
			],
			pageSize: 6,
			default: lastChoice || null,
		})

		// Si l'utilisateur choisit de quitter, sort de la boucle
		if (chosenValue === null) break

		const args = ['hardhat', 'test']

		if (chosenValue && chosenValue != 'all') args.push(chosenValue)

		lastChoice = chosenValue

		const process = spawn('npx', args, { stdio: 'inherit' })

		process.on('error', (error) => console.error(`Erreur lors de l'exécution du test : ${error.message}`))
		process.on('exit', (code) => console.log(`Processus de test terminé avec le code : ${code}`))
	}
}

chooseTest().catch(console.error)
