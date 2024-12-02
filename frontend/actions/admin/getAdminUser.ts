'use server'

import { db } from '@/drizzle/db'
import { usersTable } from '@/drizzle/schema' // Assurez-vous que 'contracts' est le bon nom de votre table

export async function getAdminUser() {
	const results = await db.select().from(usersTable)
	// .fields({ address: deployments.fromAddress })
	return results
}
