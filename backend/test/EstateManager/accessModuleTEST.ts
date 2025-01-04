import { ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { deployAllContracts } from '../utils/fixtures'

const tokenId = 1
const moduleName = 'InterventionManager'

describe('Contract EstateManager - MODULE ACCESS TEST', function () {
	it('Should grant, check, and revoke module execution access', async function () {
		const { EstateManager, manager, prestataire } = await loadFixture(deployAllContracts)

		await expect(EstateManager.connect(manager).grantExecuteModuleAccess(tokenId, moduleName, prestataire.address))
			.to.emit(EstateManager, 'ModuleRoleAssigned')
			.withArgs(tokenId, moduleName, prestataire.address)

		expect(await EstateManager.hasExecuteModuleAccess(tokenId, moduleName, prestataire.address)).to.be.true

		await expect(EstateManager.connect(manager).revokeExecuteModuleAccess(tokenId, moduleName, prestataire.address))
			.to.emit(EstateManager, 'ModuleRoleRevoked')
			.withArgs(tokenId, moduleName, prestataire.address)

		expect(await EstateManager.hasExecuteModuleAccess(tokenId, moduleName, prestataire.address)).to.be.false
	})

	it('Should revert when granting access to address(0)', async function () {
		const { EstateManager, manager } = await loadFixture(deployAllContracts)

		await expect(
			EstateManager.connect(manager).grantExecuteModuleAccess(tokenId, moduleName, ethers.ZeroAddress)
		).to.be.revertedWith('Invalid authorized address')
	})

	it('Should revert when granting access to a non-existent module', async function () {
		const { EstateManager, manager, prestataire } = await loadFixture(deployAllContracts)

		const invalidModuleName = 'NonExistentModule'

		await expect(
			EstateManager.connect(manager).grantExecuteModuleAccess(tokenId, invalidModuleName, prestataire.address)
		).to.be.revertedWith('Module not found')
	})

	it('Should revert when revoking access from an address without permissions', async function () {
		const { EstateManager, manager, prestataire } = await loadFixture(deployAllContracts)

		await expect(
			EstateManager.connect(manager).revokeExecuteModuleAccess(tokenId, moduleName, prestataire.address)
		).to.be.revertedWith('Address not authorized')
	})
})
