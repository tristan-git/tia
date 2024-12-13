import { useQuery } from '@tanstack/react-query'

export const useGetAllInterventions = (currentAccount: any) => {
	return useQuery({
		queryKey: ['useGetAllInterventions'],
		enabled: !!currentAccount,
		queryFn: async () => {
			const response = await fetch('/api/get-all-interventions', {
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
