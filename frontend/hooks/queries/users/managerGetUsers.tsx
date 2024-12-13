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
		queryKey: ['useGetManagersUsers'],
		enabled: true,
		queryFn: async () => {
			const response = await getManagerUser()
			return response
		},
	})
}
