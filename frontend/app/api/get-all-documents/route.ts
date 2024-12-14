import { db } from '@/drizzle/db'
import {
	estateManagersTable,
	usersTable,
	mintedNFTsTable,
	interventionsTable,
	documentsTable,
	userInterventionAccessDocumentTable,
	modulesTable,
} from '@/drizzle/schema'
import { eq, sql, and, or, desc } from 'drizzle-orm'

import { aliasedTable } from 'drizzle-orm'
import { NextResponse } from 'next/server'

// Fonction pour convertir les BigInt
function serializeBigInt(obj: any): any {
	return JSON.parse(JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value)))
}

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const { currentAccount } = await request.json()

		const user = await db
			.select()
			.from(usersTable)
			.where(sql`LOWER(${usersTable.walletAddress}) = LOWER(${currentAccount})`)

		const userId = user?.[0]?.id

		if (!userId) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		const createdByUser = aliasedTable(usersTable, 'createdByUser')

		const documents = await db
			.selectDistinctOn([documentsTable.id], {
				id: documentsTable.id,
				title: documentsTable.title,
				documentHash: documentsTable.documentHash,
				fileExtension: documentsTable.fileExtension,
				createdAtTimestamp: documentsTable.createdAtTimestamp,
				isValidated: interventionsTable.isValidated,
				titleIntervention: interventionsTable.title,
				indexIntervention: interventionsTable.indexIntervention,
				town: mintedNFTsTable.town,
				address: mintedNFTsTable.address,
				tokenId: mintedNFTsTable.tokenId,
				moduleId: modulesTable.id,
				rnbCode: estateManagersTable.rnbCode,
				networkTypes: estateManagersTable.networkTypes,
				estateManagerId: interventionsTable.estateManagerId,
				createdByUser: {
					id: createdByUser.id,
					walletAddress: createdByUser.walletAddress,
					firstName: createdByUser.firstName,
					lastName: createdByUser.lastName,
				},
			})
			.from(documentsTable)
			.leftJoin(userInterventionAccessDocumentTable, eq(userInterventionAccessDocumentTable.interventionId, documentsTable.interventionId))
			.leftJoin(interventionsTable, eq(interventionsTable.id, documentsTable.interventionId))
			.leftJoin(createdByUser, eq(interventionsTable.createdBy, createdByUser.id))
			.leftJoin(mintedNFTsTable, eq(mintedNFTsTable.tokenId, interventionsTable.tokenId))
			.leftJoin(estateManagersTable, eq(estateManagersTable.id, interventionsTable.estateManagerId))
			.leftJoin(modulesTable, eq(modulesTable.estateManagerId, interventionsTable.estateManagerId))
			.where(or(and(eq(userInterventionAccessDocumentTable.userId, userId), eq(userInterventionAccessDocumentTable.hasAccess, true))))
			.orderBy(desc(documentsTable.id))

		const serializedData = serializeBigInt(documents)

		return NextResponse.json(serializedData)
	} catch (error) {
		console.error('Error fetching all document:', error)
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
	}
}
