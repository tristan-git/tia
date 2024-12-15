import { useQuery } from '@tanstack/react-query'

export const useGetAllEstateNetwork = (currentAccount: any) => {
	return useQuery({
		queryKey: [`useGetAllEstateNetwork-${currentAccount}`],
		enabled: !!currentAccount,
		queryFn: async () => {
			const response = await fetch('/api/get-all-estate-network', {
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
