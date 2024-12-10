import { useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'

type UseIsInterventionPrestataireParams = {
	contractAddress: `0x${string}`
	tokenId: string
	userAddress: `0x${string}`
	titleIntervention: string
	addressInterventionManager: `0x${string}`
	createdByUserWallet: `0x${string}`
	indexIntervention: number
}

export const useIsInterventionPrestataire = ({
	contractAddress,
	tokenId,
	userAddress,
	titleIntervention,
	addressInterventionManager,
	createdByUserWallet,
	indexIntervention,
}: UseIsInterventionPrestataireParams) => {
	const moduleName = 'InterventionManager'

	const { data: hasExecuteModuleAccess } = useReadContract({
		address: contractAddress,
		abi: EstateManagerArtifact?.abi,
		functionName: 'hasExecuteModuleAccess',
		args: [BigInt(parseInt(tokenId)), moduleName, userAddress],
	})

	const { data: dataIntervention } = useReadContract({
		address: addressInterventionManager,
		abi: InterventionManagerArtifact?.abi,
		functionName: 'getInterventions',
		args: [BigInt(parseInt(tokenId)), createdByUserWallet],
	})

	return hasExecuteModuleAccess && dataIntervention?.[indexIntervention]?.title === titleIntervention && createdByUserWallet == userAddress
}
