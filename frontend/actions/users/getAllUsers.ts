'use server'

import { db } from '@/drizzle/db'
import { usersTable } from '@/drizzle/schema'

export async function getAllUsers() {
	const results = await db.select().from(usersTable)
	return results
}
