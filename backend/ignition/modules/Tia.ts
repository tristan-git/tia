import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

////////////////////////////////////////////////////////////////////////////
// VotingModule
////////////////////////////////////////////////////////////////////////////

// npx hardhat ignition deploy ignition/modules/Tia.ts  --network calypso
// npx hardhat ignition deploy ignition/modules/Tia.ts  --network localhost
// npx hardhat verify <<contract address>> --network skale
// npx hardhat verify 0x306253B640cB46eBef3DCCE9C05359aD6055869b --network calypso

// verifie estate manager
// npx hardhat verify --network calypso 0xfba3dda6b74931e74e5d7649b78db77d53e1f792 "0x1234567890abcdef1234567890abcdef12345678" "0xabcdef1234567890abcdef1234567890abcdef12" "0xF7a380EB841d015AA70E8f4626E4B9384584e0C6" "BUILDING-123"

module.exports = buildModule('TiaModule', (m) => {
	const EstateManagerFactory = m.contract('EstateManagerFactory', [], {
		id: 'EstateManagerFactoryV3',
	})

	return { EstateManagerFactory }
})
