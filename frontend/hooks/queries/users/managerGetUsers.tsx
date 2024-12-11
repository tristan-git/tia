import { useQuery } from '@tanstack/react-query'
import { getManagerUser } from '@/actions/manager/getManagerUser'

export type TUsers = {
	id: number
	firstName: string
	lastName: string
	walletAddress: string
}

export const useGetManagersUsers = () => {
	return useQuery<TUsers[]>({
		queryKey: ['adminUsers'],
		enabled: true,
		// networkMode: "online",
		// initialData,
		queryFn: async () => {
			const response = await getManagerUser()
			return response
		},
		// staleTime: Number.POSITIVE_INFINITY,
		// refetchInterval: 3_000,
	})
}
