'use client'

import { createContext, useCallback } from 'react'

import { deployNewContract } from './utils/deployContract'
import { Contracts } from './utils/EContractName'

import { useDeployContract } from 'wagmi'

// const accountsName = ['owner', 'tristan', 'sophia', 'luc']

/////////////////////////////////////////////////////////
// constant web3
/////////////////////////////////////////////////////////

// const httpProvider = 'http://127.0.0.1:8545'
// const netWorkId = 1723279934198

/////////////////////////////////////////////////////////
//  CONTEXT
/////////////////////////////////////////////////////////

interface BlockchainContextType {
	//   web3: any;
	//   getContractInstances: (contractName: Contracts[]) => () => any;
	//   getDeployedContract: (contractName: Contracts, constructorArgs: any, from: string) => any;
	//   getAccountsTest: () => any;
	//   accountsTest: any;
	//   transactions: any;
	//   setTransactions: any;
	//   contractInstance: any;
	//   setContractInstance: any;
	//   deployedContracts: any;
	//   setDeployedContracts: any;
	//   newContractInstance: any;
}

export const BlockchainContext = createContext<BlockchainContextType | null>(null)

/////////////////////////////////////////////////////////
// PROVIDER
/////////////////////////////////////////////////////////

const BlockchainProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	//   const [transactions, setTransactions] = useState([]);
	//   const [accountsTest, setAccountsTest] = useState([]);
	//   const [deployedContracts, setDeployedContracts] = useState({})
	//   const [contractInstance, setContractInstance] = useState(null);

	// const chains = useChains()
	// const config = useConfig()
	// const connections = useConnections()
	// const connectorClient = useConnectorClient()
	// const account = useAccount()
	// console.log(chains)
	// console.log(config)
	// console.log(connections)
	// console.log(connectorClient)
	// const { address } = useAccount()
	// console.log(address)

	const { deployContractAsync } = useDeployContract()

	const getDeployNewContract = useCallback(
		async (contractName: Contracts) => {
			const addressContract = await deployNewContract(contractName, deployContractAsync)
			return addressContract
		},
		[deployContractAsync]
	)

	return (
		<BlockchainContext.Provider
			value={{
				getDeployNewContract,
				// web3,
				// getContractInstances,
				// getDeployedContract,
				// getAccountsTest,
				// accountsTest,
				// transactions,
				// setTransactions,
				// deployedContracts,
				// setDeployedContracts,
				// contractInstance,
				// setContractInstance,
				// newContractInstance,
			}}
		>
			{children}
		</BlockchainContext.Provider>
	)
}

export default BlockchainProvider
