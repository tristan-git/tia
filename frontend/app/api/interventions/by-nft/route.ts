import { db } from '@/drizzle/db'
import { eq, sql } from 'drizzle-orm'
import { documentsTable, interventionsTable, modulesTable, usersTable } from '@/drizzle/schema'
import { NextResponse } from 'next/server'

function serializeBigIntRecursive(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map(serializeBigIntRecursive)
	} else if (obj instanceof Date || typeof obj?.toISOString === 'function') {
		return new Date(obj).toISOString() // Ensure it's serialized as an ISO string
	} else if (obj && typeof obj === 'object' && obj !== null) {
		return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, serializeBigIntRecursive(value)]))
	} else if (typeof obj === 'bigint') {
		return obj.toString() // Convert BigInt to string
	}
	return obj
}

export async function POST(req: any) {
	try {
		const body = await req.json()
		const { currentAccount, idEstate, tokenId } = body

		// Récupérer les interventions pour le NFT spécifique
		const interventionsByNft = await db
			.select({
				id: interventionsTable.id,
				tokenId: interventionsTable.tokenId,
				indexIntervention: interventionsTable.indexIntervention,
				title: interventionsTable.title,
				isValidated: interventionsTable.isValidated,
				validateFrom: interventionsTable.validateFrom,
				createdAtTimestamp: interventionsTable.createdAtTimestamp,
				createdBy: interventionsTable.createdBy,
				createdByUser: {
					id: usersTable.id,
					walletAddress: usersTable.walletAddress,
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
				},
				estateManagerId: interventionsTable.estateManagerId,
				moduleId: modulesTable.id,
				documents: sql`COALESCE(
					array_agg(jsonb_build_object(
						'id', ${documentsTable.id},
						'title', ${documentsTable.title},
						'documentHash', ${documentsTable.documentHash},
						'fileExtension', ${documentsTable.fileExtension},
						'createdAtTimestamp', ${documentsTable.createdAtTimestamp},
						'createdBy', ${documentsTable.createdBy}
					)) FILTER (WHERE ${documentsTable.id} IS NOT NULL), '{}'
				)`.as('documents'),
			})
			.from(interventionsTable)
			.leftJoin(documentsTable, eq(documentsTable.interventionId, interventionsTable.id))
			.leftJoin(modulesTable, eq(modulesTable.estateManagerId, interventionsTable.estateManagerId))
			.leftJoin(usersTable, eq(usersTable.id, interventionsTable.createdBy))
			.where(eq(interventionsTable.estateManagerId, idEstate))
			.groupBy(interventionsTable.id, modulesTable.id, usersTable.id)

		if (!interventionsByNft?.length) {
			return NextResponse.json({ data: [] }, { status: 200 })
		}

		const serializedData = serializeBigIntRecursive(interventionsByNft)

		return NextResponse.json({ data: serializedData }, { status: 200 })
	} catch (error) {
		console.error('Erreur de connexion au réseau:', error)
		return NextResponse.json({ message: 'Erreur de connexion au réseau', error: error?.message }, { status: 500 })
	}
}
