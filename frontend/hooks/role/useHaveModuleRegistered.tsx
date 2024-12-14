import { useReadContract } from 'wagmi'

import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'

export const useHaveModuleRegistered = (contractAddress: any, moduleName: string) => {
	const { data: address } = useReadContract({
		address: contractAddress,
		abi: EstateManagerArtifact?.abi,
		functionName: 'getModule',
		args: [moduleName],
	})

	return address !== '0x0000000000000000000000000000000000000000'
}
