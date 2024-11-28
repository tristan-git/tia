import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

////////////////////////////////////////////////////////////////////////////
// VotingModule
////////////////////////////////////////////////////////////////////////////

// npx hardhat ignition deploy ignition/modules/Tia.ts  --network calypso
// npx hardhat ignition deploy ignition/modules/Tia.ts  --network localhost
// npx hardhat verify <<contract address>> --network skale
// npx hardhat verify 0x662872d50e70ad3e9d61118Af727676791df70F9 --network calypso

// verifie estate manager
// npx hardhat verify --network calypso 0xae588422fac9589f8cb67bb6d9850f33d6e23966 "0x1234567890abcdef1234567890abcdef12345678" "0xabcdef1234567890abcdef1234567890abcdef12" "BUILDING-123"

// export const buildingManagerModule = buildModule('buildingManagerModule', (m) => {
// 	const name_ = m.getParameter('name_', 'nftBat')
// 	const symbol_ = m.getParameter('symbol_', 'nftBat2')
// 	const BuildingManager = m.contract('BuildingManager', [name_, symbol_], {
// 		// id: 'BuildingManager',
// 	})

// 	const ModuleRegistry = m.contract('ModuleRegistry', [], {
// 		// id: 'ModuleRegistry',
// 	})

// 	// Then we read the address of the deployed contract from an event
// 	// emitted by deploy()
// 	const address = m.readEventArgument(ModuleRegistry, 'Deployed', 'addr')

// 	console.log(address)

// 	const RealEstateNFT = m.contract('RealEstateNFT', [address], {
// 		// id: 'RealEstateNFT',
// 		after: [ModuleRegistry],
// 	})

// 	const InterventionManager = m.contract('InterventionManager', [], {
// 		// id: 'BuildingManager',
// 		after: [RealEstateNFT],
// 	})

// 	return { BuildingManager, ModuleRegistry, RealEstateNFT, InterventionManager }
// })

module.exports = buildModule('TiaModule', (m) => {
	const name_ = m.getParameter('name_', 'nftBat')
	const symbol_ = m.getParameter('symbol_', 'nftBat2')
	// const BuildingManager = m.contract('BuildingManager', [name_, symbol_], {
	// 	// id: 'VotingAlyra',
	// })

	const EstateManagerFactory = m.contract('EstateManagerFactory', [], {
		// id: 'BuildingManager',
	})

	const address = m.readEventArgument(EstateManagerFactory, 'FactoryDeployed', 'factoryAddress')

	console.log('-------------------')
	console.log(address)

	// const RealEstateNFT = m.contract('RealEstateNFT', [address], {
	// 	// id: 'RealEstateNFT',
	// 	after: [EstateManagerFactory],
	// })

	return { EstateManagerFactory }
})
