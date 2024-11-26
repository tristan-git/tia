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
		const realEstateNFT = await RealEstateNFTFactory.deploy(tiaAdmin, manager)
		await realEstateNFT.waitForDeployment()

		// 2. Déployer ModuleManager
		const ModuleManagerFactory = await ethers.getContractFactory('ModuleManager')
		const ModuleManager = await ModuleManagerFactory.deploy()
		await ModuleManager.waitForDeployment()

		// 3. Déployer InterventionManager
		const InterventionManagerFactory = await ethers.getContractFactory('InterventionManager')
		const interventionManager = await InterventionManagerFactory.deploy(realEstateNFT.getAddress()) // _realEstateNFT
		await interventionManager.waitForDeployment()

		// 4. Enregistrer le module InterventionManager dans ModuleManager
		await ModuleManager.registerModule('InterventionManager', await interventionManager.getAddress())

		// 5. on ajoute le address de module manager
		await realEstateNFT.connect(tiaAdmin).updateModuleManager(ModuleManager.getAddress())

		return {
			tiaAdmin,
			manager,
			account2,
			account3,
			ModuleManager: ModuleManager,
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
		it.only('Should allow assigning and revoking roles for modules', async function () {
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

		it('Should interact with InterventionManager through RealEstateNFT', async function () {
			const { RealEstateNFT, InterventionManager, tiaAdmin, manager } = await loadFixture(deployBuildingManagerFixture)

			// Mint un NFT
			await RealEstateNFT.connect(manager).mintNFT(manager.address, 1, 'vervelBlob')

			// Ajouter une intervention
			const details = 'Reparation plomberie'
			const provider = manager.address

			const data = ethers.AbiCoder.defaultAbiCoder().encode(['string', 'address'], [details, provider])

			await RealEstateNFT.connect(manager).executeModule('InterventionManager', 1, 'addIntervention', data)

			// Ajouter un document à l'intervention
			const name = 'Plumbing Report'
			const url = 'https://example.com/report.pdf'
			const hash = '0xabc123'
			const restricted = true
			const interventionIndex = 0
			const dataDocument = ethers.AbiCoder.defaultAbiCoder().encode(
				['uint256', 'string', 'string', 'string', 'bool'],
				[interventionIndex, name, url, hash, restricted]
			)

			await RealEstateNFT.connect(manager).executeModule('InterventionManager', 1, 'addDocument', dataDocument)

			const interventions = await InterventionManager.getInterventions(1)

			expect(interventions.length).to.equal(1)
			expect(interventions[0].details).to.equal(details)
			expect(interventions[0].documents.length).to.equal(1)
			expect(interventions[0].documents[0].name).to.equal(name)
		})
	})
})
