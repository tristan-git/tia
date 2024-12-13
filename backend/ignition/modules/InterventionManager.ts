import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

////////////////////////////////////////////////////////////////////////////
// VotingModule
////////////////////////////////////////////////////////////////////////////

// npx hardhat ignition deploy ignition/modules/InterventionManager.ts  --network calypso
// npx hardhat ignition deploy ignition/modules/InterventionManager.ts  --network localhost
// npx hardhat verify <<contract address>> --network skale
// npx hardhat verify 0x5d1d1dccdbc7c5399915ab7717e49002a74fd85a --network calypso

// verifie estate manager
// npx hardhat verify --network calypso 0x5d1d1dccdbc7c5399915ab7717e49002a74fd85a "0xAFde052b4DC4Ed9C08525e95a1e624Ed2fC2795c" "0xAFde052b4DC4Ed9C08525e95a1e624Ed2fC2795c"

module.exports = buildModule('InterventionManagerModule', (m) => {
	const InterventionManager = m.contract('InterventionManager', ['0xfba3dda6b74931e74e5d7649b78db77d53e1f792'], {
		id: 'InterventionManagerModuleV3',
	})

	return { InterventionManager }
})
