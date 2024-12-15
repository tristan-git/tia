import { ethers } from 'ethers'
import { useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'

const MANAGER_ROLE = ethers.keccak256(ethers.toUtf8Bytes('ESTATE_MANAGER_ROLE'))

export const useIsManager = (userAddress, contractAddress) => {
	const { data: isManager } = useReadContract({
		address: contractAddress,
		abi: EstateManagerArtifact?.abi,
		functionName: 'hasRole',
		args: [MANAGER_ROLE, userAddress],
	})

	return isManager
}
