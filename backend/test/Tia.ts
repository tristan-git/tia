import { ignition, ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'

describe('Building Manager Contracts', function () {
	// ////////////////////////////////////////////////////////////////////
	// Fixtures
	// ////////////////////////////////////////////////////////////////////

	async function deployBuildingManagerFixture() {
		const [tiaAdmin, manager, account2, account3] = await ethers.getSigners()

		// 1. Déployer EstateManagerFactory
		const ContractEstateManagerFactory = await ethers.getContractFactory('EstateManagerFactory')
		const EstateManagerFactory = await ContractEstateManagerFactory.deploy()
		await EstateManagerFactory.waitForDeployment()

		// 2. Déployer un EstateManager via la Factory
		const rnbCode = 'AB12345' // Exemple de code RNB
		const tx = await EstateManagerFactory.createEstateManager(tiaAdmin.address, tiaAdmin.address, rnbCode)
		await tx.wait()
		const estateManagerAddress = await EstateManagerFactory.deployedManagers(0)

		const ContractEstateManager = await ethers.getContractAt('EstateManager', estateManagerAddress)

		// 3. Déployer InterventionManager
		const ContractInterventionManager = await ethers.getContractFactory('InterventionManager')
		const InterventionManager = await ContractInterventionManager.deploy(estateManagerAddress)
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
			account2,
			account3,
			EstateManagerFactory,
			EstateManager: ContractEstateManager,
			InterventionManager,
		}
	}

	// async function deployBuildingManagerFixture() {
	// 	const [tiaAdmin, manager, account2, account3] = await ethers.getSigners()

	// 	// 1. Déployer EstateManager
	// 	const rnbCode = 'AB12345' // Exemple de code RNB
	// 	const ContractEstateManager = await ethers.getContractFactory('EstateManager')
	// 	const EstateManager = await ContractEstateManager.deploy(tiaAdmin.address, manager.address, rnbCode)
	// 	await EstateManager.waitForDeployment()

	// 	// 2. Déployer InterventionManager
	// 	const ContractInterventionManager = await ethers.getContractFactory('InterventionManager')
	// 	const InterventionManager = await ContractInterventionManager.deploy(EstateManager.getAddress()) // `_realEstateNFT`
	// 	await InterventionManager.waitForDeployment()

	// 	// 3. Enregistrer le module InterventionManager dans EstateManager
	// 	await EstateManager.connect(tiaAdmin).registerModule('InterventionManager', await InterventionManager.getAddress())

	// 	return {
	// 		tiaAdmin,
	// 		manager,
	// 		account2,
	// 		account3,
	// 		EstateManager,
	// 		InterventionManager,
	// 	}
	// }

	// ////////////////////////////////////////////////////////////////////
	// Tests
	// ////////////////////////////////////////////////////////////////////

	describe('Deployment', function () {
		it('Should deploy contracts and set the correct owner', async function () {
			const { ModuleManager, tiaAdmin, manager } = await loadFixture(deployBuildingManagerFixture)

			// Vérifier si le contrat est déployé correctement
			expect(await ModuleManager.owner()).to.equal(tiaAdmin.address)
		})
	})

	describe('Functionality', function () {
		it('Should allow assigning and revoking roles for modules', async function () {
			const { EstateManager, manager, account2 } = await loadFixture(deployBuildingManagerFixture)

			// Assigner un rôle pour le module InterventionManager
			await EstateManager.connect(manager).assignModuleRole(1, 'InterventionManager', account2.address, 2)

			// Vérifier les permissions
			const [isAuthorized, accessLevel] = await EstateManager.getModuleAccess(1, 'InterventionManager', account2.address)

			expect(isAuthorized).to.be.true
			expect(accessLevel).to.equal(2)

			// Révoquer le rôle
			await EstateManager.connect(manager).revokeModuleRole(1, 'InterventionManager', account2.address)

			// Vérifier que l'accès est révoqué
			const [isAuthorizedAfter, accessLevelAfter] = await EstateManager.getModuleAccess(
				1,
				'InterventionManager',
				account2.address
			)

			console.log({ isAuthorizedAfter, accessLevelAfter })

			expect(isAuthorizedAfter).to.be.false
			expect(accessLevelAfter).to.equal(0)
		})

		it('Should restrict module execution to authorized accounts', async function () {
			const { EstateManager, manager, account2 } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await EstateManager.connect(manager).mintNFT(manager.address, 1, 'vervelBlob')

			// Assigner un rôle lecture/écriture à account2
			await EstateManager.connect(manager).assignModuleRole(1, 'InterventionManager', account2.address, 2)

			// Essayer d'exécuter une action non autorisée avec un autre compte
			const details = 'Unauthorized attempt'
			const data = ethers.AbiCoder.defaultAbiCoder().encode(['string', 'address'], [details, manager.address])
			await expect(
				EstateManager.connect(account2).executeModule('InterventionManager', 1, 'addIntervention', data)
			).to.be.revertedWith('Not authorized for this module and token')
		})

		it('Should enforce access levels for modules', async function () {
			const { EstateManager, manager, account2 } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await EstateManager.connect(manager).mintNFT(manager.address, 1, 'vervelBlob')

			// Assigner un rôle lecture seule à account2
			await EstateManager.connect(manager).assignModuleRole(1, 'InterventionManager', account2.address, 1)

			// Essayer une action d'écriture avec un accès lecture seule
			const details = 'Write attempt'
			const data = ethers.AbiCoder.defaultAbiCoder().encode(['string', 'address'], [details, manager.address])
			await expect(
				EstateManager.connect(account2).executeModule('InterventionManager', 1, 'addIntervention', data)
			).to.be.revertedWith('Insufficient access level')
		})

		it('Should allow minting and interacting with EstateManager', async function () {
			const { EstateManager, tiaAdmin, manager } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await EstateManager.connect(manager).mintNFT(manager.address, 1, 'vervelBlob')

			// Vérifier le propriétaire du NFT
			expect(await EstateManager.ownerOf(1)).to.equal(manager.address)
		})

		it('Should interact with InterventionManager through EstateManager', async function () {
			const { EstateManager, InterventionManager, tiaAdmin, manager } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await EstateManager.connect(tiaAdmin).mintNFT(tiaAdmin.address, 'vervelBlob')

			// Assigner un rôle d'accès en écriture au manager pour le module "InterventionManager"
			await EstateManager.connect(tiaAdmin).grantExecuteModuleAccess(1, 'InterventionManager', tiaAdmin.address)

			// Ajouter une intervention
			const interventionHash = ethers.keccak256(ethers.toUtf8Bytes('Reparation plomberie:Plomberie'))
			const dataIntervention = ethers.AbiCoder.defaultAbiCoder().encode(['bytes32'], [interventionHash])

			await EstateManager.connect(tiaAdmin).executeModule('InterventionManager', 1, 'addIntervention', dataIntervention)

			// Ajouter un document à l'intervention
			const documentHash = ethers.keccak256(ethers.toUtf8Bytes('Plumbing Report:Facture:0xabc123'))
			const interventionIndex = 0
			const dataDocument = ethers.AbiCoder.defaultAbiCoder().encode(['uint256', 'bytes32'], [interventionIndex, documentHash])

			await EstateManager.connect(tiaAdmin).executeModule('InterventionManager', 1, 'addDocument', dataDocument)

			// Récupérer les interventions associées
			const interventions = await InterventionManager.getInterventions(1, tiaAdmin.address)

			console.log('=================================')
			console.log(interventions[0].interventionHash)
			console.log(interventions[0].documents[0].documentHash)

			// Vérifications
			expect(interventions.length).to.equal(1)
			expect(interventions[0].interventionHash).to.equal(interventionHash)
			expect(interventions[0].documents.length).to.equal(1)
			expect(interventions[0].documents[0].documentHash).to.equal(documentHash)

			// Validate the intervention
			const dataValidate = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [0])

			await EstateManager.connect(tiaAdmin).executeModule('InterventionManager', 1, 'validateIntervention', dataValidate)

			// Verify intervention validation
			const validatedIntervention = await InterventionManager.connect(tiaAdmin).getInterventions(1, tiaAdmin.address)

			expect(validatedIntervention[0].isValidated).to.be.true
		})
	})
})
