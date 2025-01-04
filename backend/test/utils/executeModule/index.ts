import { ethers } from 'hardhat'

////////////////////////////////////////////////////////////////////////////////////////////////////////

export const addIntervention = async (EstateManager: any, manager: any, { tokenId, titleIntervention, prestataire }: any) => {
	await EstateManager.connect(manager).grantExecuteModuleAccess(tokenId, 'InterventionManager', prestataire.address)

	const dataIntervention = ethers.AbiCoder.defaultAbiCoder().encode(['string'], [titleIntervention])

	const tx = await EstateManager.connect(prestataire).executeModule(
		'InterventionManager',
		tokenId,
		'addIntervention',
		dataIntervention
	)

	const receipt = await tx.wait()
	const block = await ethers.provider.getBlock(receipt.blockNumber)
	const timestamp = block.timestamp

	return { timestamp, tx }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

export const addDocument = async (EstateManager: any, { tokenId, documentTitle, prestataire }: any) => {
	const documentHash = ethers.keccak256(ethers.toUtf8Bytes(documentTitle))

	const documentData = ethers.AbiCoder.defaultAbiCoder().encode(
		['uint256', 'string', 'bytes32'],
		[0, documentTitle, documentHash]
	)

	const tx = await EstateManager.connect(prestataire).executeModule('InterventionManager', tokenId, 'addDocument', documentData)

	return { documentHash, tx }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

export const validIntervention = async (EstateManager: any, manager: any, { tokenId, interventionIndex, prestataire }: any) => {
	const dataValidate = ethers.AbiCoder.defaultAbiCoder().encode(['uint256', 'address'], [interventionIndex, prestataire.address])

	const tx = await EstateManager.connect(manager).executeModule(
		'InterventionManager',
		tokenId,
		'validateIntervention',
		dataValidate
	)

	return { tx }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

export const grantInterventionAccess = async (
	EstateManager: any,
	manager: any,
	{ tokenId, interventionIndex, prestataire }: any
) => {
	const dataGrantAccess = ethers.AbiCoder.defaultAbiCoder().encode(
		['uint256', 'address'],
		[interventionIndex, prestataire.address]
	)

	const tx = await EstateManager.connect(manager).executeModule(
		'InterventionManager',
		tokenId,
		'grantInterventionAccess',
		dataGrantAccess
	)

	return { tx }
}


export const revokeInterventionAccess = async (
	EstateManager: any,
	manager: any,
	{ tokenId, interventionIndex, prestataire }: any
) => {
	const dataGrantAccess = ethers.AbiCoder.defaultAbiCoder().encode(
		['uint256', 'address'],
		[interventionIndex, prestataire.address]
	)

	const tx = await EstateManager.connect(manager).executeModule(
		'InterventionManager',
		tokenId,
		'revokeInterventionAccess',
		dataGrantAccess
	)

	return { tx }
}
