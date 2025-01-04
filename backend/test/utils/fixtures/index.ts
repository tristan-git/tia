import { ethers } from 'hardhat'

export const deployAllContracts = async () => {
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
