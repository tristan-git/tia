import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

////////////////////////////////////////////////////////////////////////////
// VotingModule
////////////////////////////////////////////////////////////////////////////

// npx hardhat ignition deploy ignition/modules/InterventionManager.ts  --network calypso
// npx hardhat ignition deploy ignition/modules/InterventionManager.ts  --network localhost
// npx hardhat verify <<contract address>> --network skale
// npx hardhat verify 0xc812b5093150d6cbc5f7206c9513de6663700286 --network calypso

// verifie estate manager
// npx hardhat verify --network calypso 0xc812b5093150d6cbc5f7206c9513de6663700286 "0xAFde052b4DC4Ed9C08525e95a1e624Ed2fC2795c"

module.exports = buildModule('InterventionManagerModule', (m) => {
	const InterventionManager = m.contract('InterventionManager', ['0xfba3dda6b74931e74e5d7649b78db77d53e1f792'], {
		id: 'InterventionManagerModuleV3',
	})

	return { InterventionManager }
})
