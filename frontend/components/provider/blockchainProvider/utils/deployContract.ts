import { artifactVotes } from '@/constants/artifacts/votes'
import { Contracts } from './EContractName'

export const deployNewContract = async (contractName: Contracts, deployContract) => {
	const addressDeployed = await deployContract({
		abi: artifactVotes.abi,
		bytecode: artifactVotes.bytecode,
	})

	return addressDeployed
}
