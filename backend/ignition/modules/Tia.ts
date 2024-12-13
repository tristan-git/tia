import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

////////////////////////////////////////////////////////////////////////////
// VotingModule
////////////////////////////////////////////////////////////////////////////

// npx hardhat ignition deploy ignition/modules/Tia.ts  --network calypso
// npx hardhat ignition deploy ignition/modules/Tia.ts  --network localhost
// npx hardhat verify <<contract address>> --network skale
// npx hardhat verify 0x4b97e9E60Bd0B4421c05CaFEEf476DA2ADD8B8fF --network calypso

// verifie estate manager
// npx hardhat verify --network calypso 0x5D1d1DCcdbC7c5399915aB7717e49002a74fd85a "0x1234567890abcdef1234567890abcdef12345678" "0xabcdef1234567890abcdef1234567890abcdef12" "0xF7a380EB841d015AA70E8f4626E4B9384584e0C6" "BUILDING-123"

module.exports = buildModule('TiaModule', (m) => {
	const EstateManagerFactory = m.contract('EstateManagerFactory', [], {
		id: 'EstateManagerFactoryV10',
	})

	return { EstateManagerFactory }
})
