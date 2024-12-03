import { useQuery } from '@tanstack/react-query'

export type TEstateManager = {
	id: string
	admin: {
		id: number
		firstName: string
		lastName: string
		walletAddress: string
	}
	manager: {
		id: number
		firstName: string
		lastName: string
		walletAddress: string
	}
	rnbCode: string
	factoryId: string
	createdAtBlock: bigint
	createdAtTransactionHash: string
	createdAtTimestamp: Date
}

export const useGetManagerEstate = () => {
	return useQuery({
		queryKey: ['getManagerEstate'],
		enabled: true,
		queryFn: async () => {
			const response = await fetch('/api/manager/get-manager-estate')
			return response.json()
		},
		// staleTime: Number.POSITIVE_INFINITY,
		// refetchInterval: 3_000,
	})
}
