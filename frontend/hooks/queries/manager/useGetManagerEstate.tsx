import { useQuery } from '@tanstack/react-query'
import { getManagerEstate } from '@/actions/manager/getManagerEstate'

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
		// enabled: false,
		queryFn: async () => {
			try {
				const response = await getManagerEstate()
				return response
			} catch (error) {
				console.log(error)
			}
		},

		// staleTime: Number.POSITIVE_INFINITY,
		// refetchInterval: 3_000,
	})
}
