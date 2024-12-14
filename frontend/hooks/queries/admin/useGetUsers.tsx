import { useQuery } from '@tanstack/react-query'
import { getAdminUser } from '@/actions/admin/getAdminUser'

export const useGetAdminUsers = () => {
	return useQuery({
		queryKey: ['useGetAdminUsers'],
		enabled: true,
		queryFn: async () => {
			const response = await getAdminUser()
			return response
		},
	})
}
