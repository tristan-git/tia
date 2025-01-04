import { ethers } from 'hardhat'
import { expect } from 'chai'

describe('Contract EstateManagerFactory', function () {
	let EstateManagerFactory: any

	before(async function () {
		const ContractEstateManagerFactory = await ethers.getContractFactory('EstateManagerFactory')
		EstateManagerFactory = await ContractEstateManagerFactory.deploy()
		await EstateManagerFactory.waitForDeployment()
	})

	it('Event FactoryDeployed doit etre emis apres le deployement du contrat', async function () {
		await expect(EstateManagerFactory.deploymentTransaction())
			.to.emit(EstateManagerFactory, 'FactoryDeployed')
			.withArgs(await EstateManagerFactory.getAddress())
	})
})
