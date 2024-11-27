import { ignition, ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { buildingManagerModule } from '../ignition/modules/tia/buildingManager'

describe('Building Manager Contracts', function () {
	const metadata = {
		name: 'Building ID',
		description: 'A beautiful office building located downtown.',
		image: 'ipfs://Qm.../building.png',
		attributes: [
			{
				trait_type: 'Location',
				value: 'Downtown',
			},
			{
				trait_type: 'Size',
				value: '5000 sq ft',
			},
		],
		moduleInterventions: [
			{
				details: 'Nettoyage façade',
				provider: '0xAnotherProviderAddress',
				timestamp: 1638029200,
				documents: [
					{
						name: 'rapport_intervention.pdf',
						url: 'https://blob.service.com/doc1.pdf',
						hash: '86c703c2f75f4cb8082e6f2986ff9d75b8c15279beb483554adc0b6eaa4de9b4',
						restricted: true,
					},
					{
						name: 'rapport_intervention.pdf',
						url: 'https://blob.service.com/doc1.pdf',
						hash: '86c703c2f75f4cb8082e6f2986ff9d75b8c15279beb483554adc0b6eaa4de9b4',
						restricted: true,
					},
				],
			},
		],
		moduleEspaceVert: [
			// ...autreData
		],
	}

	// ////////////////////////////////////////////////////////////////////
	// Fixtures
	// ////////////////////////////////////////////////////////////////////

	async function deployBuildingManagerFixture() {
		const [tiaAdmin, manager, account2, account3] = await ethers.getSigners()

		// 1. Déployer RealEstateNFT
		const RealEstateNFTFactory = await ethers.getContractFactory('RealEstateNFT')
		const realEstateNFT = await RealEstateNFTFactory.deploy(tiaAdmin.address, manager.address)
		await realEstateNFT.waitForDeployment()

		// 2. Déployer InterventionManager
		const InterventionManagerFactory = await ethers.getContractFactory('InterventionManager')
		const interventionManager = await InterventionManagerFactory.deploy(realEstateNFT.getAddress()) // _realEstateNFT
		await interventionManager.waitForDeployment()

		// 3. Enregistrer le module InterventionManager dans RealEstateNFT
		await realEstateNFT.connect(tiaAdmin).registerModule('InterventionManager', interventionManager.getAddress())

		return {
			tiaAdmin,
			manager,
			account2,
			account3,
			RealEstateNFT: realEstateNFT,
			InterventionManager: interventionManager,
		}
	}

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
			const { RealEstateNFT, manager, account2 } = await loadFixture(deployBuildingManagerFixture)

			// Assigner un rôle pour le module InterventionManager
			await RealEstateNFT.connect(manager).assignModuleRole(1, 'InterventionManager', account2.address, 2)

			// Vérifier les permissions
			const [isAuthorized, accessLevel] = await RealEstateNFT.getModuleAccess(1, 'InterventionManager', account2.address)

			expect(isAuthorized).to.be.true
			expect(accessLevel).to.equal(2)

			// Révoquer le rôle
			await RealEstateNFT.connect(manager).revokeModuleRole(1, 'InterventionManager', account2.address)

			// Vérifier que l'accès est révoqué
			const [isAuthorizedAfter, accessLevelAfter] = await RealEstateNFT.getModuleAccess(
				1,
				'InterventionManager',
				account2.address
			)

			console.log({ isAuthorizedAfter, accessLevelAfter })

			expect(isAuthorizedAfter).to.be.false
			expect(accessLevelAfter).to.equal(0)
		})

		it('Should restrict module execution to authorized accounts', async function () {
			const { RealEstateNFT, manager, account2 } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await RealEstateNFT.connect(manager).mintNFT(manager.address, 1, 'vervelBlob')

			// Assigner un rôle lecture/écriture à account2
			await RealEstateNFT.connect(manager).assignModuleRole(1, 'InterventionManager', account2.address, 2)

			// Essayer d'exécuter une action non autorisée avec un autre compte
			const details = 'Unauthorized attempt'
			const data = ethers.AbiCoder.defaultAbiCoder().encode(['string', 'address'], [details, manager.address])
			await expect(
				RealEstateNFT.connect(account2).executeModule('InterventionManager', 1, 'addIntervention', data)
			).to.be.revertedWith('Not authorized for this module and token')
		})

		it('Should enforce access levels for modules', async function () {
			const { RealEstateNFT, manager, account2 } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await RealEstateNFT.connect(manager).mintNFT(manager.address, 1, 'vervelBlob')

			// Assigner un rôle lecture seule à account2
			await RealEstateNFT.connect(manager).assignModuleRole(1, 'InterventionManager', account2.address, 1)

			// Essayer une action d'écriture avec un accès lecture seule
			const details = 'Write attempt'
			const data = ethers.AbiCoder.defaultAbiCoder().encode(['string', 'address'], [details, manager.address])
			await expect(
				RealEstateNFT.connect(account2).executeModule('InterventionManager', 1, 'addIntervention', data)
			).to.be.revertedWith('Insufficient access level')
		})

		it('Should allow minting and interacting with RealEstateNFT', async function () {
			const { RealEstateNFT, tiaAdmin, manager } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await RealEstateNFT.connect(manager).mintNFT(manager.address, 1, 'vervelBlob')

			// Vérifier le propriétaire du NFT
			expect(await RealEstateNFT.ownerOf(1)).to.equal(manager.address)
		})

		it.only('Should interact with InterventionManager through RealEstateNFT', async function () {
			const { RealEstateNFT, InterventionManager, tiaAdmin, manager } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await RealEstateNFT.connect(tiaAdmin).mintNFT(tiaAdmin.address, 1, 'vervelBlob')

			// Assigner un rôle d'accès en écriture au manager pour le module "InterventionManager"
			await RealEstateNFT.connect(tiaAdmin).assignModuleRole(1, 'InterventionManager', manager.address, 2)

			// Ajouter une intervention
			const interventionHash = ethers.keccak256(ethers.toUtf8Bytes('Reparation plomberie:Plomberie'))
			const dataIntervention = ethers.AbiCoder.defaultAbiCoder().encode(['bytes32'], [interventionHash])

			await RealEstateNFT.connect(manager).executeModule('InterventionManager', 1, 'addIntervention', dataIntervention)

			// Ajouter un document à l'intervention
			const documentHash = ethers.keccak256(ethers.toUtf8Bytes('Plumbing Report:Facture:0xabc123'))
			const interventionIndex = 0
			const dataDocument = ethers.AbiCoder.defaultAbiCoder().encode(['uint256', 'bytes32'], [interventionIndex, documentHash])

			await RealEstateNFT.connect(manager).executeModule('InterventionManager', 1, 'addDocument', dataDocument)

			// Récupérer les interventions associées
			const interventions = await InterventionManager.getInterventions(1, manager.address)

			console.log('interventions llall')
			console.log(interventions)

			// Vérifications
			expect(interventions.length).to.equal(1)
			expect(interventions[0].interventionHash).to.equal(interventionHash)
			expect(interventions[0].documents.length).to.equal(1)
			expect(interventions[0].documents[0].documentHash).to.equal(documentHash)

			// Validate the intervention
			const dataValidate = ethers.AbiCoder.defaultAbiCoder().encode(['uint256'], [0])
			await RealEstateNFT.connect(manager).executeModule('InterventionManager', 1, 'validateIntervention', dataValidate)

			// Verify intervention validation
			const validatedIntervention = await InterventionManager.getInterventions(1, manager.address)

			expect(validatedIntervention[0].isValidated).to.be.true
		})
	})
})
