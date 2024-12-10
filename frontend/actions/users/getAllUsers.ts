'use server'

import { db } from '@/drizzle/db'
import { usersTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function getAllUsers() {
	const results = await db.select().from(usersTable)
	return results
}
