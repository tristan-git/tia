'use server'

import { db } from '@/drizzle/db'
import { documentsTable, estateManagersTable, interventionsTable, userInterventionAccessDocumentTable, usersTable } from '@/drizzle/schema'
import { sql } from 'drizzle-orm'

export async function createDocument(createDocumentData: {
	interventionId: any
	title: any
	documentHash: any
	createdBy: string
	fileExtension: string
}) {
	try {
		const user = await db
			.select({ id: usersTable.id })
			.from(usersTable)
			.where(sql`LOWER(${usersTable.walletAddress}) = LOWER(${createDocumentData.createdBy})`)

		await db.insert(documentsTable).values({
			interventionId: createDocumentData.interventionId,
			title: createDocumentData.title,
			documentHash: createDocumentData.documentHash,
			createdAtTimestamp: new Date(),
			createdBy: user[0].id,
			fileExtension: createDocumentData?.fileExtension || 'png',
		})

		const [intervention] = await db
			.select()
			.from(interventionsTable)
			.where(sql`${interventionsTable.id} = ${createDocumentData.interventionId}`)

		// Récupérer le managerId depuis estateManagersTable
		const [estateManager] = await db
			.select({ managerId: estateManagersTable.managerId })
			.from(estateManagersTable)
			.where(sql`${estateManagersTable.id} = ${intervention.estateManagerId}`)

		// donne acces au a la lecture des document a intervenant

		await db
			.insert(userInterventionAccessDocumentTable)
			.values({
				interventionId: intervention.id,
				tokenId: BigInt(intervention.tokenId),
				indexIntervention: intervention.indexIntervention,
				estateManagerId: intervention.estateManagerId,
				userId: user[0].id,
				changedBy: user[0].id,
				hasAccess: true,
				changedAtTimestamp: new Date(),
			})
			.onConflictDoUpdate({
				target: [
					userInterventionAccessDocumentTable.interventionId,
					userInterventionAccessDocumentTable.userId,
					userInterventionAccessDocumentTable.estateManagerId,
				],
				set: {
					hasAccess: true,
					changedBy: user[0].id,
					userId: user[0].id,
					changedAtTimestamp: new Date(),
				},
			})

		// donne acces au a la lecture des document a manager
		await db
			.insert(userInterventionAccessDocumentTable)
			.values({
				interventionId: intervention.id,
				tokenId: BigInt(intervention.tokenId),
				indexIntervention: intervention.indexIntervention,
				estateManagerId: intervention.estateManagerId,
				userId: estateManager.managerId,
				changedBy: user[0].id,
				hasAccess: true,
				changedAtTimestamp: new Date(),
			})
			.onConflictDoUpdate({
				target: [
					userInterventionAccessDocumentTable.interventionId,
					userInterventionAccessDocumentTable.userId,
					userInterventionAccessDocumentTable.estateManagerId,
				],
				set: {
					hasAccess: true,
					changedBy: user[0].id,
					userId: estateManager.managerId,
					changedAtTimestamp: new Date(),
				},
			})

		return { success: true, message: 'document add successfully' }
	} catch (error) {
		console.error('Error document added:', error)
		return { success: false, message: 'Error document added:', error }
	}
}
