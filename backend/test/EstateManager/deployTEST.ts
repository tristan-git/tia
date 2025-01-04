import { ethers } from 'hardhat'
import { expect } from 'chai'

describe('Contract EstateManager DEPLOY TEST', function () {
	let EstateManagerFactory: any
	let rnbCode = 'AB12345'

	before(async function () {
		const ContractEstateManagerFactory = await ethers.getContractFactory('EstateManagerFactory')
		EstateManagerFactory = await ContractEstateManagerFactory.deploy()
		await EstateManagerFactory.waitForDeployment()
	})

	it('Emits the EstateManagerCreated event upon deployment', async function () {
		const [admin, manager] = await ethers.getSigners()

		const tx = await EstateManagerFactory.createEstateManager(admin.address, manager.address, rnbCode)
		await tx.wait()
		const deployedAddress = await EstateManagerFactory.deployedManagers(0)

		await expect(tx)
			.to.emit(EstateManagerFactory, 'EstateManagerCreated')
			.withArgs(admin.address, manager.address, deployedAddress, ethers?.encodeBytes32String(rnbCode))
	})

	it('Should revert if _admin is address zero', async function () {
		const [, manager] = await ethers.getSigners()

		await expect(
			EstateManagerFactory.createEstateManager(ethers.ZeroAddress, manager.address, rnbCode)
		).to.be.revertedWithCustomError(EstateManagerFactory, 'AdminAddressZero')
	})

	it('Should revert if _manager is address zero', async function () {
		const [admin] = await ethers.getSigners()

		await expect(
			EstateManagerFactory.createEstateManager(admin.address, ethers.ZeroAddress, rnbCode)
		).to.be.revertedWithCustomError(EstateManagerFactory, 'ManagerAddressZero')
	})

	it('Should revert if _rnbCode is empty', async function () {
		const [admin, manager] = await ethers.getSigners()

		await expect(EstateManagerFactory.createEstateManager(admin.address, manager.address, '')).to.be.revertedWithCustomError(
			EstateManagerFactory,
			'InvalidRnbCode'
		)
	})

	it('Should revert if _rnbCode exceeds 32 characters', async function () {
		const [admin, manager] = await ethers.getSigners()
		rnbCode = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456GDGD'

		await expect(EstateManagerFactory.createEstateManager(admin.address, manager.address, rnbCode)).to.be.revertedWithCustomError(
			EstateManagerFactory,
			'InvalidRnbCode'
		)
	})

	it('Should assign DEFAULT_ADMIN_ROLE to the admin address', async function () {
		rnbCode = 'AB12345'
		const [admin, manager] = await ethers.getSigners()
		const tx = await EstateManagerFactory.createEstateManager(admin.address, manager.address, rnbCode)
		await tx.wait()

		const deployedAddress = await EstateManagerFactory.deployedManagers(0)
		const EstateManager = await ethers.getContractAt('EstateManager', deployedAddress)

		const DEFAULT_ADMIN_ROLE = await EstateManager.DEFAULT_ADMIN_ROLE()
		expect(await EstateManager.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true
	})

	it('Should assign ESTATE_MANAGER_ROLE to the manager address', async function () {
		const [admin, manager] = await ethers.getSigners()
		const tx = await EstateManagerFactory.createEstateManager(admin.address, manager.address, rnbCode)
		await tx.wait()

		const deployedAddress = await EstateManagerFactory.deployedManagers(0)
		const EstateManager = await ethers.getContractAt('EstateManager', deployedAddress)

		const ESTATE_MANAGER_ROLE = await EstateManager.ESTATE_MANAGER_ROLE()
		expect(await EstateManager.hasRole(ESTATE_MANAGER_ROLE, manager.address)).to.be.true
	})

	it('Should correctly set the token name and symbol', async function () {
		const [admin, manager] = await ethers.getSigners()
		const tx = await EstateManagerFactory.createEstateManager(admin.address, manager.address, rnbCode)
		await tx.wait()

		const deployedAddress = await EstateManagerFactory.deployedManagers(0)
		const EstateManager = await ethers.getContractAt('EstateManager', deployedAddress)

		const tokenName = await EstateManager.name()
		const tokenSymbol = await EstateManager.symbol()

		expect(tokenName).to.equal(`REALESTATE-${rnbCode}`)
		expect(tokenSymbol).to.equal('REALESTATE')
	})

	it('Should initialize nextTokenId to 1', async function () {
		const [admin, manager] = await ethers.getSigners()
		const tx = await EstateManagerFactory.createEstateManager(admin.address, manager.address, rnbCode)
		await tx.wait()

		const deployedAddress = await EstateManagerFactory.deployedManagers(0)
		const EstateManager = await ethers.getContractAt('EstateManager', deployedAddress)

		const nextTokenId = await EstateManager.getNextTokenId()
		expect(nextTokenId).to.equal(1)
	})
})
