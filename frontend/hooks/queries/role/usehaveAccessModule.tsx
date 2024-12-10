import { useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'

export const useHaveAccessModule = ({ contractAddress, tokenId, userAddress }: any) => {
	const moduleName = 'InterventionManager'

	const { data: hasExecuteModuleAccess } = useReadContract({
		address: contractAddress,
		abi: EstateManagerArtifact?.abi,
		functionName: 'hasExecuteModuleAccess',
		args: [BigInt(parseInt(tokenId)), moduleName, userAddress],
	})

	return hasExecuteModuleAccess
}
