import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/actions/users/getusers'

export type TUsers = {
	id: number
	firstName: string
	lastName: string
	walletAddress: string
}

export const useGetUsersPrestataire = () => {
	return useQuery<TUsers[]>({
		queryKey: ['useGetUsersPrestataire'],
		enabled: true,
		queryFn: async () => {
			const response = await getUsers(3) // role prestataire
			return response
		},
	})
}
