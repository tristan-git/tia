'use server'

import { db } from '@/drizzle/db'
import { usersTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function getUsers(accountRoleId:any) {
	const results = await db.select().from(usersTable).where(eq(usersTable.accountRoleId, accountRoleId))
	return results
}
