import { useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'

export const useIsInterventionPrestataire = (contractAddress: any, tokenId: any, userAddress: any) => {
	const moduleName = 'InterventionManager'

	const { data: isInterventionPrestataire, isError } = useReadContract({
		address: contractAddress,
		abi: EstateManagerArtifact?.abi,
		functionName: 'hasExecuteModuleAccess',
		args: [BigInt(parseInt(tokenId)), moduleName, userAddress],
	})

	return isInterventionPrestataire
}
