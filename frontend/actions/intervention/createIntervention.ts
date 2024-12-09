'use server'

import { db } from '@/drizzle/db'
import { interventionsTable, usersTable } from '@/drizzle/schema'
import { sql } from 'drizzle-orm'

export async function createIntervention(createInterventionData: {
	tokenId: string
	title: string
	estateManagerId: string
	createdBy: string
	indexIntervention: number
}) {
	try {
		const user = await db
			.select({ id: usersTable.id })
			.from(usersTable)
			.where(sql`LOWER(${usersTable.walletAddress}) = LOWER(${createInterventionData.createdBy})`)

		await db.insert(interventionsTable).values({
			tokenId: BigInt(createInterventionData.tokenId),
			title: createInterventionData.title,
			estateManagerId: createInterventionData.estateManagerId,
			createdAtTimestamp: new Date(),
			createdBy: user[0].id,
			indexIntervention: createInterventionData.indexIntervention,
		})

		return { success: true, message: 'intervention created successfully' }
	} catch (error) {
		console.error('Error assigning permission:', error)
		return { success: false, message: 'Error created intervention', error }
	}
}
