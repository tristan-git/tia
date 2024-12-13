import { useReadContract } from 'wagmi'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'

export const usePermissionDocument = (contractAddress: any, tokenId: any, userAddress: any, interventionIndex: any) => {
	const _tokenId = tokenId
	const _interventionIndex = interventionIndex
	const _account = userAddress

	const { data: haveAccess } = useReadContract({
		scopeKey: 'usePermissionDocument',
		address: contractAddress,
		abi: InterventionManagerArtifact?.abi,
		functionName: 'hasInterventionAccess',
		args: [BigInt(parseInt(_tokenId)), _interventionIndex, _account],
	})

	return haveAccess
}
