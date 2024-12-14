import { useQuery } from '@tanstack/react-query'

export const useGetInterventionsByNft = (currentAccount: any, idEstate: any, tokenId: any) => {
	return useQuery({
		queryKey: [`useGetInterventionsByNft-${currentAccount}`],
		enabled: !!currentAccount || !!idEstate || !!parseInt(tokenId),
		queryFn: async () => {
			const response = await fetch('/api/get-interventions-by-nft', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ currentAccount, idEstate, tokenId: parseInt(tokenId) }),
			})

			return response.json()
		},
	})
}
