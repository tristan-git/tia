import { readContract } from '@wagmi/core'
import { type ReadContractReturnType } from '@wagmi/core'

import { config } from '../../customRainbowKitProvider'
import { Contracts } from './EContractName'
import { artifactVotes } from '@/constants/artifacts/votes'

interface ReadContractParam {
	functionName: string
	args?: any[]
	account?: string
}

interface ContractReadConfig {
	contractName: Contracts
	address: string
	params: ReadContractParam[]
}

interface ContractReadResult {
	contractName: string
	address: string
	data: {
		[functionName: string]: { value: any; error?: any }
	}
}

export const customReadContract = async (contractConfigs: ContractReadConfig[]): Promise<ContractReadResult[]> => {
	const results: ContractReadResult[] = []

	for (const configItem of contractConfigs) {
		const promises = configItem.params.map(async (param) => {
			try {
				const data = await readContract(config, {
					abi: artifactVotes.abi,
					address: configItem.address,
					functionName: param.functionName,
					args: param.args || [],
				} as any)

				return {
					functionName: param.functionName,
					result: { value: data, error: null },
				}
			} catch (error) {
				return {
					functionName: param.functionName,
					result: { value: null, error },
				}
			}
		})

		const resolvedResults = await Promise.all(promises)

		// Transformer le tableau en objet avec `functionName` comme clé
		const dataObject = resolvedResults.reduce((acc, { functionName, result }) => {
			acc[functionName] = result
			return acc
		}, {} as { [functionName: string]: { value: any; error?: any } })

		results.push({
			contractName: configItem.contractName,
			address: configItem.address,
			data: dataObject,
		})
	}

	return results
}
