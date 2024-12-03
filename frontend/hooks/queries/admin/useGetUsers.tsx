import { useQuery } from '@tanstack/react-query'
import { getAdminUser } from '@/actions/admin/getAdminUser'

export type TUsers = {
	id: number
	firstName: string
	lastName: string
	walletAddress: string
}

export const useGetAdminUsers = () => {
	return useQuery<TUsers[]>({
		queryKey: ['adminUsers'],
		enabled: true,
		// networkMode: "online",
		// initialData,
		queryFn: async () => {
			const response = await getAdminUser()
			return response
		},
		// staleTime: Number.POSITIVE_INFINITY,
		// refetchInterval: 3_000,
	})
}
