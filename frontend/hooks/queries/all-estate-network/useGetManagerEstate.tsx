import { useQuery } from '@tanstack/react-query'

export const useGetAllEstateNetwork = () => {
	return useQuery({
		queryKey: ['useGetAllEstateNetwork'],
		enabled: true,
		queryFn: async () => {
			const response = await fetch('/api/get-all-estate-network') // 
			return response.json()
		},
	})
}
