'use server'

import { db } from '@/drizzle/db'
import { interventionsTable, usersTable } from '@/drizzle/schema'
import { sql, eq } from 'drizzle-orm'

export async function validIntervention(validInterventionData: {
	tokenId: string
	indexIntervention: number
	interventionId: any
	validatedBy: string
}) {
	try {
		const user = await db
			.select({ id: usersTable.id })
			.from(usersTable)
			.where(sql`LOWER(${usersTable.walletAddress}) = LOWER(${validInterventionData.validatedBy})`)

		await db
			.update(interventionsTable)
			.set({
				isValidated: true,
				validateFrom: user[0].id,
			})
			.where(eq(interventionsTable.id, validInterventionData?.interventionId))

		return { success: true, message: 'intervention validated successfully' }
	} catch (error) {
		console.error('Error assigning validated:', error)
		return { success: false, message: 'Error validated intervention', error }
	}
}
