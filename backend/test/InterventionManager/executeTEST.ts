import { ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { deployAllContracts } from '../utils/fixtures'
import {
	addDocument,
	addIntervention,
	grantInterventionAccess,
	revokeInterventionAccess,
	validIntervention,
} from '../utils/executeModule'

const tokenId = 1
const interventionIndex = 0
const titleIntervention = 'Plomberie'
const documentTitle = 'Inspection Report'

describe('Contract EstateManager - EXECUTE MODULE TEST', function () {
	it('Should revert if module does not exist', async function () {
		const { EstateManager, manager } = await loadFixture(deployAllContracts)

		const tokenId = 1
		const invalidModuleName = 'NonExistentModule'
		const data = ethers.AbiCoder.defaultAbiCoder().encode(['string'], ['Invalid Action'])

		await expect(
			EstateManager.connect(manager).executeModule(invalidModuleName, tokenId, 'addIntervention', data)
		).to.be.revertedWith('Module not found')
	})

	it('Should revert if user does not have permissions', async function () {
		const { EstateManager, manager, prestataire } = await loadFixture(deployAllContracts)

		const tokenId = 1
		const moduleName = 'InterventionManager'
		const data = ethers.AbiCoder.defaultAbiCoder().encode(['string'], ['Unauthorized Action'])

		// Ensure prestataire does not have access
		await expect(
			EstateManager.connect(prestataire).executeModule(moduleName, tokenId, 'addIntervention', data)
		).to.be.revertedWith('Not authorized for this module and token')
	})

	it('Should add intervention', async function () {
		const { EstateManager, InterventionManager, manager, prestataire } = await loadFixture(deployAllContracts)

		const { tx, timestamp } = await addIntervention(EstateManager, manager, {
			tokenId,
			titleIntervention,
			prestataire,
		})

		await expect(tx)
			.to.emit(InterventionManager, 'InterventionAdded')
			.withArgs(tokenId, titleIntervention, timestamp, prestataire.address, interventionIndex)

		const interventions = await InterventionManager.getInterventions(tokenId, prestataire.address)

		expect(interventions.length).to.equal(1)
		expect(interventions[interventionIndex].title).to.equal(titleIntervention)
	})

	it('Should allow adding a document to an intervention', async function () {
		const { EstateManager, InterventionManager, manager, prestataire } = await loadFixture(deployAllContracts)

		await addIntervention(EstateManager, manager, { tokenId, titleIntervention, prestataire })
		const { documentHash, tx } = await addDocument(EstateManager, { tokenId, documentTitle, prestataire })

		await expect(tx)
			.to.emit(InterventionManager, 'DocumentAdded')
			.withArgs(tokenId, interventionIndex, documentHash, documentTitle, prestataire.address)

		const documents = await InterventionManager.getDocuments(tokenId, interventionIndex, prestataire.address)
		expect(documents.length).to.equal(1)
		expect(documents[0].title).to.equal(documentTitle)
		expect(documents[0].documentHash).to.equal(documentHash)
	})

	it('Should successfully validate an intervention', async function () {
		const { EstateManager, InterventionManager, manager, prestataire } = await loadFixture(deployAllContracts)

		await addIntervention(EstateManager, manager, { tokenId, titleIntervention, prestataire })
		await addDocument(EstateManager, { tokenId, documentTitle, prestataire })
		const { tx } = await validIntervention(EstateManager, manager, { tokenId, interventionIndex, prestataire })

		await expect(tx).to.emit(InterventionManager, 'InterventionValidated').withArgs(tokenId, interventionIndex, manager.address)

		const interventions = await InterventionManager.getInterventions(tokenId, prestataire.address)

		expect(interventions[interventionIndex].isValidated).to.be.true
	})

	it('Should revert if the intervention is already validated', async function () {
		const { EstateManager, InterventionManager, manager, prestataire } = await loadFixture(deployAllContracts)

		await addIntervention(EstateManager, manager, { tokenId, titleIntervention, prestataire })
		await addDocument(EstateManager, { tokenId, documentTitle, prestataire })
		const { tx } = await validIntervention(EstateManager, manager, { tokenId, interventionIndex, prestataire })

		await expect(tx).to.emit(InterventionManager, 'InterventionValidated').withArgs(tokenId, interventionIndex, manager.address)

		const interventions = await InterventionManager.getInterventions(tokenId, prestataire.address)

		expect(interventions[interventionIndex].isValidated).to.be.true

		await expect(validIntervention(EstateManager, manager, { tokenId, interventionIndex, prestataire })).to.be.revertedWith(
			'Already validated'
		)
	})

	it('Should revert if the intervention index is invalid', async function () {
		const { EstateManager, manager, prestataire } = await loadFixture(deployAllContracts)

		await addIntervention(EstateManager, manager, { tokenId, titleIntervention, prestataire })

		await expect(validIntervention(EstateManager, manager, { tokenId, interventionIndex: 2, prestataire })).to.be.revertedWith(
			'Invalid intervention index'
		)
	})

	it('Should successfully grant access to an intervention', async function () {
		const { EstateManager, InterventionManager, manager, prestataire } = await loadFixture(deployAllContracts)

		await addIntervention(EstateManager, manager, { tokenId, titleIntervention, prestataire })

		const { tx } = await grantInterventionAccess(EstateManager, manager, { tokenId, interventionIndex, prestataire })

		await expect(tx)
			.to.emit(InterventionManager, 'InterventionAccessChanged')
			.withArgs(tokenId, interventionIndex, prestataire.address, manager.address, true)

		const hasAccess = await InterventionManager.hasInterventionAccess(tokenId, interventionIndex, prestataire.address)
		expect(hasAccess).to.be.true
	})

	it('Should successfully revoke access to an intervention', async function () {
		const { EstateManager, InterventionManager, manager, prestataire } = await loadFixture(deployAllContracts)

		await addIntervention(EstateManager, manager, { tokenId, titleIntervention, prestataire })

		const { tx } = await revokeInterventionAccess(EstateManager, manager, { tokenId, interventionIndex, prestataire })

		await expect(tx)
			.to.emit(InterventionManager, 'InterventionAccessChanged')
			.withArgs(tokenId, interventionIndex, prestataire.address, manager.address, false)

		const hasAccess = await InterventionManager.hasInterventionAccess(tokenId, interventionIndex, prestataire.address)
		expect(hasAccess).to.be.false
	})
})
