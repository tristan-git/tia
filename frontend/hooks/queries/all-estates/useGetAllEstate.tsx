import { useQuery } from '@tanstack/react-query'

export const useGetAllEstate = (currentAccount: any) => {
	return useQuery({
		queryKey: [`useGetAllEstate-${currentAccount}`],
		enabled: !!currentAccount,
		queryFn: async () => {
			const response = await fetch('/api/get-all-estate-nft', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ currentAccount }),
			})

			return response.json()
		},
	})
}
