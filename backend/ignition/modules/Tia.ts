import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

////////////////////////////////////////////////////////////////////////////
// VotingModule
////////////////////////////////////////////////////////////////////////////

// npx hardhat ignition deploy ignition/modules/Tia.ts  --network calypso
// npx hardhat ignition deploy ignition/modules/Tia.ts  --network localhost
// npx hardhat verify <<contract address>> --network skale
// npx hardhat verify 0x01b760f627a35af62C5fD457aCf9AA16F8629346 --network calypso

// verifie estate manager
// npx hardhat verify --network calypso 0x1f5caaf10c212f0e620a3db39ab2732d58ca4822 "0x1234567890abcdef1234567890abcdef12345678" "0xabcdef1234567890abcdef1234567890abcdef12" "0xF7a380EB841d015AA70E8f4626E4B9384584e0C6" "BUILDING-123"

module.exports = buildModule('TiaModule', (m) => {
	const EstateManagerFactory = m.contract('EstateManagerFactory', [], {
		id: 'EstateManagerFactoryV7',
	})

	return { EstateManagerFactory }
})
