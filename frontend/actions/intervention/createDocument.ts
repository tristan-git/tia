'use server'

import { db } from '@/drizzle/db'
import { documentsTable, usersTable } from '@/drizzle/schema'
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

		return { success: true, message: 'intervention created successfully' }
	} catch (error) {
		console.error('Error assigning permission:', error)
		return { success: false, message: 'Error created intervention', error }
	}
}
