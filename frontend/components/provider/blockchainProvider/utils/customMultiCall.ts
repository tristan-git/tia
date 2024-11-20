import { multicall } from '@wagmi/core'

import { Contracts } from './EContractName'
import { config } from '../../customRainbowKitProvider'
import { artifactVotes } from '@/constants/artifacts/votes'

interface ContractFunctionParam {
	functionName: string
	args?: any[]
}

export const customMultiCall = async ({
	contractName,
	address,
	params,
}: {
	address: string
	contractName: Contracts
	params: ContractFunctionParam[]
}) => {
	const contract = {
		address: address,
		abi: artifactVotes.abi,
	} as any

	const contracts = params.map((param) => ({
		...contract,
		functionName: param.functionName,
		args: param.args || [],
	}))

	const result = await multicall(config, { contracts })

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// TODO ChainDoesNotSupportContract: Chain "Hardhat" does not support contract "multicall3".
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')

	console.log(result)
}
