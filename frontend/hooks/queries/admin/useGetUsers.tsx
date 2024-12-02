import { useQuery } from '@tanstack/react-query'

// import '@/drizzle/envConfig'
// import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from '@/drizzle/schema'

import { usersTable } from '@/drizzle/schema' // Assurez-vous que 'contracts' est le bon nom de votre table
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { getAdminUser } from '@/actions/admin/getAdminUser'

const db = drizzle(sql, { schema })

export type TUsers = {
	id: number
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
		refetchInterval: 3_000,
	})
}
