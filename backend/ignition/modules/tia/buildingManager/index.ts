import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

////////////////////////////////////////////////////////////////////////////
// VotingModule
////////////////////////////////////////////////////////////////////////////

// npx hardhat ignition deploy ignition/modules/myNftWithRoles/index.ts  --network calypso
// npx hardhat ignition deploy ignition/modules/myNftWithRoles/index.ts  --network localhost

export const buildingManagerModule = buildModule('buildingManagerModule', (m) => {
	const name_ = m.getParameter('name_', 'nftBat')
	const symbol_ = m.getParameter('symbol_', 'nftBat2')
	const BuildingManager = m.contract('BuildingManager', [name_, symbol_], {
		// id: 'BuildingManager',
	})

	const ModuleRegistry = m.contract('ModuleRegistry', [], {
		// id: 'ModuleRegistry',
	})

	// Then we read the address of the deployed contract from an event
	// emitted by deploy()
	const address = m.readEventArgument(ModuleRegistry, 'Deployed', 'addr')

	console.log(address)

	const RealEstateNFT = m.contract('RealEstateNFT', [address], {
		// id: 'RealEstateNFT',
		after: [ModuleRegistry],
	})

	const InterventionManager = m.contract('InterventionManager', [], {
		// id: 'BuildingManager',
		after: [RealEstateNFT],
	})

	return { BuildingManager, ModuleRegistry, RealEstateNFT, InterventionManager }
})

// module.exports = buildModule('buildingManagerModule', (m) => {
// 	const name_ = m.getParameter('name_', 'nftBat')
// 	const symbol_ = m.getParameter('symbol_', 'nftBat2')
// 	const BuildingManager = m.contract('BuildingManager', [name_, symbol_], {
// 		// id: 'VotingAlyra',
// 	})

// 	return { BuildingManager }
// })
