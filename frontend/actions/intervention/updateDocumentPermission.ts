'use server'

import { db } from '@/drizzle/db'
import { userInterventionAccessDocumentTable, usersTable } from '@/drizzle/schema'
import { sql } from 'drizzle-orm'

export async function updateDocumentPermission(permissionDocumentData: {
	validatedBy: any
	interventionId: any
	indexIntervention: any
	tokenId: any
	userAccountGranted: any
	granted: any
	estateManagerId: any
}) {
	try {
		const userValidatedBy = await db
			.select({ id: usersTable.id })
			.from(usersTable)
			.where(sql`LOWER(${usersTable.walletAddress}) = LOWER(${permissionDocumentData.validatedBy})`)

		const userAccountGranted = await db
			.select({ id: usersTable.id })
			.from(usersTable)
			.where(sql`LOWER(${usersTable.walletAddress}) = LOWER(${permissionDocumentData.userAccountGranted})`)

		await db
			.insert(userInterventionAccessDocumentTable)
			.values({
				interventionId: permissionDocumentData.interventionId,
				tokenId: BigInt(permissionDocumentData.tokenId),
				indexIntervention: permissionDocumentData.indexIntervention,
				estateManagerId: permissionDocumentData.estateManagerId,
				userId: userAccountGranted[0].id,
				changedBy: userValidatedBy[0].id,
				hasAccess: permissionDocumentData.granted,
				changedAtTimestamp: new Date(),
			})
			.onConflictDoUpdate({
				target: [
					userInterventionAccessDocumentTable.interventionId,
					userInterventionAccessDocumentTable.userId,
					userInterventionAccessDocumentTable.estateManagerId,
				],
				set: {
					hasAccess: permissionDocumentData.granted,
					changedBy: userValidatedBy[0].id,
					changedAtTimestamp: new Date(),
				},
			})

		return { success: true, message: 'permission document successfully' }
	} catch (error) {
		console.error('Error permission document:', error)
		return { success: false, message: 'Error validated permission document', error }
	}
}
