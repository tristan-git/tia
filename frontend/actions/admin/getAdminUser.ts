'use server'

import { db } from '@/drizzle/db'
import { usersTable } from '@/drizzle/schema'

export async function getAdminUser() {
	const results = await db.select().from(usersTable)
	// .fields({ address: deployments.fromAddress })
	return results
}
