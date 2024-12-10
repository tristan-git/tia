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

export const useGetManagerEstateNft = (currentAccount: any, idEstate: any) => {
	return useQuery({
		queryKey: ['useGetManagerEstateNft'],
		enabled: !!currentAccount || !!idEstate,
		queryFn: async () => {
			const response = await fetch('/api/manager/get-manager-estate-nft', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ currentAccount, idEstate }),
			})

			return response.json()
		},
		// staleTime: Number.POSITIVE_INFINITY,
		// refetchInterval: 3_000,
	})
}
