'use server'

import { db } from '@/drizzle/db'
import { usersTable } from '@/drizzle/schema'
import { ne } from 'drizzle-orm'

export async function getManagerUser() {
	const results = await db.select().from(usersTable).where(ne(usersTable.accountRoleId, 1))
	return results
}
