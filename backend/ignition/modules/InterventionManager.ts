import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

////////////////////////////////////////////////////////////////////////////
// VotingModule
////////////////////////////////////////////////////////////////////////////

// npx hardhat ignition deploy ignition/modules/InterventionManager.ts  --network calypso
// npx hardhat ignition deploy ignition/modules/InterventionManager.ts  --network localhost
// npx hardhat verify <<contract address>> --network skale
// npx hardhat verify 0x585f2834a2C2924Ad30ED057D8f1caA83D1BdaDc --network calypso

// verifie estate manager
// npx hardhat verify --network calypso 0x585f2834a2C2924Ad30ED057D8f1caA83D1BdaDc "0x1234567890abcdef1234567890abcdef12345678" 

module.exports = buildModule('InterventionManagerModule', (m) => {
	const InterventionManager = m.contract('InterventionManager', ['0xae588422fac9589f8cb67bb6d9850f33d6e23966'], {
		// id: 'BuildingManager',
	})

	return { InterventionManager }
})
