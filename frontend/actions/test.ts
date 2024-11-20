'use server'

import { getUsers } from '@/drizzle/db'

export async function create() {
	'use server'
	const toto = await getUsers()
	return toto
}
