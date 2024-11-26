import { ignition, ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { buildingManagerModule } from '../ignition/modules/tia/buildingManager'

const json = {
	buildingInfo: {
		id: 1,
		address: '123 Rue Exemple',
		yearBuilt: 1985,
		area: '150 sqm',
	},

	interventions: [
		{
			id: 1,
			date: '2024-01-15',
			description: 'Plomberie',
			documents: [
				{
					name: 'rapport_intervention.pdf',
					url: 'https://blob.service.com/doc1.pdf',
					restricted: true,
				},
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
					signature: '0x5b9f1edbaf...',
					restricted: true,
				},
			],
		},
		{
			id: 2,
			date: '2024-03-10',
			description: 'Peinture',
			documents: [
				{
					name: 'devis.pdf',
					url: 'https://blob.service.com/doc2.pdf',
					restricted: false,
				},
			],
		},
	],

	
	roles: {
		owners: ['0xOwnerAddress1', '0xOwnerAddress2'],
		managers: ['0xManagerAddress'],
		tenants: ['0xTenantAddress'],
	},
}


// vercel 
// https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/hash_name_symbol_/id_nft/interventions/lefichier.json
// https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/hash_name_symbol_/id_nft/interventions/MetadataEntryHASH/HASHdocument.png

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TEST
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe('Voting contract', function () {
	// ////////////////////////////////////////////////////////////////////
	// Fixtures
	// ////////////////////////////////////////////////////////////////////

	async function deployBuildingManagerFixture() {
		const [owner, account1, account2, account3] = await ethers.getSigners()

		const { BuildingManager } = await ignition.deploy(buildingManagerModule)
		const typedContractBuildingManager = await ethers.getContractAt('BuildingManager', await BuildingManager.getAddress())

		return {
			BuildingManager: typedContractBuildingManager,
			owner,
			account1,
			account2,
			account3,
		}
	}

	// //////////////////////////////////////////////////////////////////////////////////////////////
	//
	// //////////////////////////////////////////////////////////////////////////////////////////////

	describe('Deployment Voting contract', function () {
		it('Should have the deployed address owner', async function () {
			const { BuildingManager, owner } = await loadFixture(deployBuildingManagerFixture)
			expect(await BuildingManager.owner()).to.equal(owner.address)
		})
	})

	// //////////////////////////////////////////////////////////////////////////////////////////////
	//
	// //////////////////////////////////////////////////////////////////////////////////////////////

	describe('Register Building', function () {
		it('Should register a new building and mint an NFT', async function () {
			const { BuildingManager, owner, account1, account2 } = await loadFixture(deployBuildingManagerFixture)

			const owners = [owner.address, account1.address]
			const shares = [70, 30]
			const metadataURI = 'ipfs://QmBuildingMetadataURI'

			await BuildingManager.registerBuilding(owners, shares, metadataURI)

			const buildingId = 1
			const tokenOwner = await BuildingManager.ownerOf(buildingId)
			const tedtt = await BuildingManager.buildings(1)

			expect(tokenOwner).to.equal(owner.address)

			const tokenURI = await BuildingManager.tokenURI(buildingId)
			expect(tokenURI).to.equal(metadataURI)
		})

		it('Should emit BuildingRegistered event', async function () {
			const { BuildingManager, owner, account1 } = await loadFixture(deployBuildingManagerFixture)

			const owners = [owner.address, account1.address]
			const shares = [70, 30]
			const metadataURI = 'ipfs://QmBuildingMetadataURI'

			await expect(BuildingManager.registerBuilding(owners, shares, metadataURI))
				.to.emit(BuildingManager, 'BuildingRegistered')
				.withArgs(1, owners, metadataURI)
		})
	})

	// //////////////////////////////////////////////////////////////////////////////////////////////
	//
	// //////////////////////////////////////////////////////////////////////////////////////////////

	describe('Assign Roles', function () {
		it('Should assign roles to a user for a building', async function () {
			const { BuildingManager, owner, account1, account2 } = await loadFixture(deployBuildingManagerFixture)

			const owners = [owner.address]
			const shares = [100]
			const metadataURI = 'ipfs://QmBuildingMetadataURI'

			await BuildingManager.registerBuilding(owners, shares, metadataURI)

			const buildingId = 1

			// Assign "tenant" role
			await BuildingManager.assignRole(buildingId, account1.address, 'tenant')
			const rolesAccount1 = await BuildingManager.getRoles(buildingId, account1.address)
			expect(rolesAccount1.isTenant).to.be.true

			// Assign "manager" role
			await BuildingManager.assignRole(buildingId, account2.address, 'manager')
			const rolesAccount2 = await BuildingManager.getRoles(buildingId, account2.address)

			// console.log(rolesAccount2?.[0])
			// console.log(rolesAccount2?.[1])
			// console.log(rolesAccount2?.isManager)
			// console.log(rolesAccount2?.isIntervenant)
			expect(rolesAccount2.isManager).to.be.true
		})

		it('Should emit RoleAssigned event', async function () {
			const { BuildingManager, owner, account1 } = await loadFixture(deployBuildingManagerFixture)

			const owners = [owner.address]
			const shares = [100]
			const metadataURI = 'ipfs://QmBuildingMetadataURI'

			await BuildingManager.registerBuilding(owners, shares, metadataURI)

			const buildingId = 1

			await expect(BuildingManager.assignRole(buildingId, account1.address, 'tenant'))
				.to.emit(BuildingManager, 'RoleAssigned')
				.withArgs(buildingId, account1.address, 'tenant')
		})

		it('Should revert if non-owner tries to assign roles', async function () {
			const { BuildingManager, owner, account1, account2 } = await loadFixture(deployBuildingManagerFixture)

			const owners = [owner.address]
			const shares = [100]
			const metadataURI = 'ipfs://QmBuildingMetadataURI'

			await BuildingManager.registerBuilding(owners, shares, metadataURI)

			const buildingId = 1

			// Attempt role assignment by a non-owner
			await expect(BuildingManager.connect(account2).assignRole(buildingId, account1.address, 'tenant')).to.be.revertedWith(
				'Only the NFT owner can assign roles'
			)
		})
	})

	// //////////////////////////////////////////////////////////////////////////////////////////////
	//
	// //////////////////////////////////////////////////////////////////////////////////////////////

	describe('Retrieve Metadata', function () {
		it('Should return the correct metadata URI for a given tokenId', async function () {
			const { BuildingManager, owner } = await loadFixture(deployBuildingManagerFixture)

			// Enregistrer un nouveau bâtiment
			const owners = [owner.address]
			const shares = [100]
			const metadataURI = 'ipfs://QmBuildingMetadataURI'

			await BuildingManager.registerBuilding(owners, shares, metadataURI)

			const buildingId = 1 // Le premier bâtiment enregistré aura l'ID 1

			// Appeler la fonction tokenURI pour récupérer les métadonnées
			const tokenURI = await BuildingManager.tokenURI(buildingId)

			console.log(tokenURI)

			// Vérifier que l'URI retournée est correcte
			expect(tokenURI).to.equal(metadataURI)
		})

		// it('Should revert if the tokenId does not exist', async function () {
		// 	const { BuildingManager } = await loadFixture(deployBuildingManagerFixture)

		// 	// Essayer de récupérer les métadonnées pour un tokenId inexistant
		// 	await expect(BuildingManager.tokenURI(999)).to.be.revertedWithCustomError(BuildingManager, 'ERC721: invalid token ID')
		// })
	})

	// //////////////////////////////////////////////////////////////////////////////////////////////
	//
	// //////////////////////////////////////////////////////////////////////////////////////////////

	describe('Add Dynamic Metadata', function () {
		it('Should allow authorized users to add metadata', async function () {
			const { BuildingManager, owner, account1 } = await loadFixture(deployBuildingManagerFixture)

			// Enregistrer un nouveau bâtiment
			const owners = [owner.address]
			const shares = [100]
			const metadataURI = 'ipfs://QmBuildingMetadataURI'

			await BuildingManager.registerBuilding(owners, shares, metadataURI)

			const buildingId = 1

			// Assigner un rôle à account1 pour le bâtiment
			await BuildingManager.assignRole(buildingId, account1.address, 'manager')

			async function hashIntervention(interventions) {
				// Convertir l'objet en chaîne JSON ordonnée
				const jsonString = JSON.stringify(interventions, Object.keys(interventions).sort())

				// Convertir la chaîne en ArrayBuffer
				const encoder = new TextEncoder()
				const data = encoder.encode(jsonString)

				// Calculer le hash
				const hashBuffer = await crypto.subtle.digest('SHA-256', data)

				// Convertir le hash en chaîne hexadécimale
				const hashArray = Array.from(new Uint8Array(hashBuffer))
				const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
				return hashHex
			}

			const interventions = [
				{
					id: 1,
					date: '2024-01-15',
					description: 'Plomberie',
					documents: [
						{
							name: 'rapport_intervention.pdf',
							url: 'https://blob.service.com/doc1.pdf',
							restricted: true,
						},
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
							signature: '0x5b9f1edbaf...',
							restricted: true,
						},
					],
				},
			]

			const hashHex = await hashIntervention(interventions)
			console.log("Hash SHA-256 de l'intervention:", hashHex)

			// Ajouter des métadonnées dynamiques
			const dynamicMetadataURI = 'ipfs://QmDynamicMetadataURI'
			const dynamicMetadataHash = hashHex

			await BuildingManager.connect(account1).addDynamicMetadata(buildingId, dynamicMetadataHash)

			console.log(await BuildingManager.connect(owner).getMetadata(1))

			// Vérifier que les métadonnées ont été ajoutées
			const metadata = await BuildingManager.getMetadata(buildingId)
			expect(metadata[0].hash).to.equal(dynamicMetadataHash)
		})

		it('Should revert if an unauthorized user tries to add metadata', async function () {
			const { BuildingManager, owner, account1, account2 } = await loadFixture(deployBuildingManagerFixture)

			// Enregistrer un bâtiment
			const owners = [owner.address]
			const shares = [100]
			const metadataURI = 'ipfs://QmBuildingMetadataURI'

			await BuildingManager.registerBuilding(owners, shares, metadataURI)

			const buildingId = 1

			const dynamicMetadataHash = '86c703c2f75f4cb8082e6f2986ff9d75b8c15279beb483554adc0b6eaa4de9b4'

			await expect(BuildingManager.connect(account2).addDynamicMetadata(buildingId, dynamicMetadataHash)).to.be.revertedWith(
				'Unauthorized to add metadata'
			)
		})
	})
})
