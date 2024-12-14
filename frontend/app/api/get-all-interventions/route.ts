import { db } from '@/drizzle/db'
import {
	estateManagersTable,
	usersTable,
	modulesTable,
	mintedNFTsTable,
	interventionsTable,
	documentsTable,
	userModuleAccessTable,
	userInterventionAccessDocumentTable,
} from '@/drizzle/schema'
import { eq, sql, and, or } from 'drizzle-orm'

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

		// Alias pour les utilisateurs
		const createdByUser = aliasedTable(usersTable, 'createdByUser')
		const managerUser = aliasedTable(usersTable, 'managerUser')

		const interventions = await db
			.select({
				id: interventionsTable.id,
				tokenId: interventionsTable.tokenId,
				title: interventionsTable.title,
				estateManagerId: interventionsTable.estateManagerId,
				createdBy: interventionsTable.createdBy,
				createdAtTimestamp: interventionsTable.createdAtTimestamp,
				isValidated: interventionsTable.isValidated,
				validateFrom: interventionsTable.validateFrom,
				indexIntervention: interventionsTable.indexIntervention,
				moduleId: modulesTable.id,
				town: mintedNFTsTable.town,
				address: mintedNFTsTable.address,
				rnbCode: estateManagersTable.rnbCode,
				networkTypes: estateManagersTable.networkTypes,
				img: mintedNFTsTable.img,
				createdByUser: {
					id: createdByUser.id,
					walletAddress: createdByUser.walletAddress,
					firstName: createdByUser.firstName,
					lastName: createdByUser.lastName,
				},
				managerDetail: {
					id: managerUser.id,
					walletAddress: managerUser.walletAddress,
					firstName: managerUser.firstName,
					lastName: managerUser.lastName,
				},
				documents: sql`(
					SELECT json_agg(json_build_object(
						'id', ${documentsTable.id},
						'title', ${documentsTable.title},
						'documentHash', ${documentsTable.documentHash},
						'fileExtension', ${documentsTable.fileExtension},
						'createdAtTimestamp', ${documentsTable.createdAtTimestamp},
						'createdBy', ${documentsTable.createdBy}
					))
					FROM ${documentsTable}
					WHERE ${documentsTable.interventionId} = ${interventionsTable.id}
				)`.as('documents'),
			})
			.from(interventionsTable)
			.leftJoin(createdByUser, eq(interventionsTable.createdBy, createdByUser.id)) // Jointure pour createdByUser
			.leftJoin(estateManagersTable, eq(estateManagersTable.id, interventionsTable.estateManagerId))
			.leftJoin(managerUser, eq(managerUser.id, estateManagersTable.managerId))
			.leftJoin(mintedNFTsTable, eq(mintedNFTsTable.estateManagerId, interventionsTable.estateManagerId))
			.leftJoin(modulesTable, eq(modulesTable.estateManagerId, interventionsTable.estateManagerId))
			.leftJoin(userInterventionAccessDocumentTable, eq(userInterventionAccessDocumentTable.interventionId, interventionsTable.id))
			.where(
				or(
					eq(interventionsTable.createdBy, userId),
					and(
						eq(userInterventionAccessDocumentTable.userId, userId),
						eq(userInterventionAccessDocumentTable.hasAccess, true),
						eq(userInterventionAccessDocumentTable.indexIntervention, interventionsTable.indexIntervention),
						eq(userInterventionAccessDocumentTable.estateManagerId, interventionsTable.estateManagerId),
						eq(userInterventionAccessDocumentTable.tokenId, interventionsTable.tokenId)
					)
				)
			)
			.groupBy(
				interventionsTable.id,
				interventionsTable.tokenId,
				interventionsTable.title,
				interventionsTable.estateManagerId,
				interventionsTable.createdBy,
				interventionsTable.createdAtTimestamp,
				interventionsTable.isValidated,
				interventionsTable.validateFrom,
				interventionsTable.indexIntervention,
				modulesTable.id,
				mintedNFTsTable.town,
				mintedNFTsTable.address,
				mintedNFTsTable.metadataURI,
				estateManagersTable.rnbCode,
				estateManagersTable.networkTypes,
				mintedNFTsTable.img,
				createdByUser.id,
				createdByUser.walletAddress,
				createdByUser.firstName,
				createdByUser.lastName,
				managerUser.id,
				managerUser.walletAddress,
				managerUser.firstName,
				managerUser.lastName
			)
			.orderBy(interventionsTable.id)

		const serializedData = serializeBigInt(interventions)

		return NextResponse.json(serializedData)
	} catch (error) {
		console.error('Error fetching all nft:', error)
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
	}
}
