import { useQuery } from '@tanstack/react-query'
import { getAllUsers } from '@/actions/users/getAllUsers'

export type TUsers = {
	id: number
	firstName: string
	lastName: string
	walletAddress: string
}

export const useGetAllUsers = () => {
	return useQuery<TUsers[]>({
		queryKey: ['adminUsers'],
		enabled: true,
		queryFn: async () => {
			const response = await getAllUsers()
			return response
		},
	})
}
