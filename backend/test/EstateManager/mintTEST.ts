import { ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { deployAllContracts } from '../utils/fixtures'

const tokenURI = 'https://example.com/metadata/1'

describe('Contract EstateManager - MINT TEST', function () {
	it('Should allow an administrator to mint a new NFT', async function () {
		const { EstateManager, manager } = await loadFixture(deployAllContracts)

		const tokenId = 1

		await EstateManager.connect(manager).mintNFT(manager.address, tokenURI)

		expect(await EstateManager.ownerOf(tokenId)).to.equal(manager.address)
		expect(await EstateManager.getMetadataURI(tokenId)).to.equal(tokenURI)
	})

	it('Should revert if _to is address(0)', async function () {
		const { EstateManager, manager } = await loadFixture(deployAllContracts)

		await expect(EstateManager.connect(manager).mintNFT(ethers.ZeroAddress, tokenURI)).to.be.revertedWithCustomError(
			EstateManager,
			'InvalidAddress'
		)
	})

	it('Should revert if caller does not have ESTATE_MANAGER_ROLE', async function () {
		const { EstateManager, prestataire } = await loadFixture(deployAllContracts)

		const estateManagerRole = await EstateManager.ESTATE_MANAGER_ROLE()

		await expect(EstateManager.connect(prestataire).mintNFT(prestataire.address, tokenURI))
			.to.be.revertedWithCustomError(EstateManager, 'AccessControlUnauthorizedAccount')
			.withArgs(prestataire.address, estateManagerRole)
	})
})
