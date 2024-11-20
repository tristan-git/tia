import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

////////////////////////////////////////////////////////////////////////////
// VotingModule
////////////////////////////////////////////////////////////////////////////

// npx hardhat ignition deploy ignition/modules/myNftWithRoles/index.ts  --network calypso
// npx hardhat ignition deploy ignition/modules/myNftWithRoles/index.ts  --network localhost

// export const myNftWithRolesModule = buildModule('myNftWithRolesModule', (m) => {
// 	const votingAlyra = m.contract('Voting', [], {
// 		id: 'VotingAlyra',
// 	})

// 	return { votingAlyra }
// })

// 0x5FbDB2315678afecb367f032d93F642f64180aa3

module.exports = buildModule('myNftWithRolesModule', (m) => {
	const name_ = m.getParameter('name_', 'nftBat')
	const symbol_ = m.getParameter('symbol_', 'nftBat2')
	const MyNFTWithRoles = m.contract('MyNFTWithRoles', [name_, symbol_], {
		// id: 'VotingAlyra',
	})

	return { MyNFTWithRoles }
})
