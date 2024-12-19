import { ignition, ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'

describe('Building Manager Contracts', function () {
	// ////////////////////////////////////////////////////////////////////
	// Fixtures
	// ////////////////////////////////////////////////////////////////////

	async function deployBuildingManagerFixture() {
		const [tiaAdmin, manager, prestataire, lecteur] = await ethers.getSigners()

		// 1. Déployer EstateManagerFactory
		const ContractEstateManagerFactory = await ethers.getContractFactory('EstateManagerFactory')
		const EstateManagerFactory = await ContractEstateManagerFactory.deploy()
		await EstateManagerFactory.waitForDeployment()

		// 2. Déployer un EstateManager via la Factory
		const rnbCode = 'AB12345' // Exemple de code RNB
		const tx = await EstateManagerFactory.createEstateManager(tiaAdmin.address, manager.address, rnbCode)
		await tx.wait()
		const estateManagerAddress = await EstateManagerFactory.deployedManagers(0)

		const ContractEstateManager = await ethers.getContractAt('EstateManager', estateManagerAddress)

		console.log('icicicicicici')

		// 3. Déployer InterventionManager
		const ContractInterventionManager = await ethers.getContractFactory('InterventionManager')
		const InterventionManager = await ContractInterventionManager.deploy(estateManagerAddress, manager.address)
		await InterventionManager.waitForDeployment()

		// 4. Enregistrer le module InterventionManager via la Factory
		await EstateManagerFactory.connect(tiaAdmin).registerModuleInManager(
			estateManagerAddress,
			'InterventionManager',
			InterventionManager.getAddress()
		)

		return {
			tiaAdmin,
			manager,
			prestataire,
			lecteur,
			EstateManagerFactory,
			EstateManager: ContractEstateManager,
			InterventionManager,
		}
	}

	// ////////////////////////////////////////////////////////////////////
	// Tests
	// ////////////////////////////////////////////////////////////////////

	describe.only('TOTOTO', function () {
		it('Should allow replay attack (intentionally reproducing the vulnerability)', async function () {
			const { EstateManager, InterventionManager, manager } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await EstateManager.connect(manager).mintNFT(manager.address, 'vervelBlob')

			// Assigner un rôle d'accès pour le module "InterventionManager"
			await EstateManager.connect(manager).grantExecuteModuleAccess(1, 'InterventionManager', manager.address)

			// Ajouter une intervention (première exécution légitime)
			const interventionHash = ethers.keccak256(ethers.toUtf8Bytes('Reparation plomberie:Plomberie'))
			const dataIntervention = ethers.AbiCoder.defaultAbiCoder().encode(['bytes32'], [interventionHash])

			// Première transaction légitime
			await EstateManager.connect(manager).executeModule('InterventionManager', 1, 'addIntervention', dataIntervention)

			// Récupérer les interventions pour vérifier la première exécution
			const interventionsBeforeReplay = await InterventionManager.getInterventions(1, manager.address)
			expect(interventionsBeforeReplay.length).to.equal(1)

			// Rejouer exactement les mêmes données (replay attack)
			await EstateManager.connect(manager).executeModule('InterventionManager', 1, 'addIntervention', dataIntervention)

			// Récupérer les interventions après le replay
			const interventionsAfterReplay = await InterventionManager.getInterventions(1, manager.address)

			// Vérifier que l'intervention a été ajoutée une deuxième fois (comportement indésirable)
			expect(interventionsAfterReplay.length).to.equal(2) // La liste contient maintenant deux interventions
		})
	})
})
