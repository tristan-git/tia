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
	moduleInterventionManagersTable,
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

		const adminIdAlias = aliasedTable(usersTable, 'adminId')
		const managerIdAlias = aliasedTable(usersTable, 'managerId')

		const network = await db
			.selectDistinct({
				id: estateManagersTable.id,
				networkTypes: estateManagersTable.networkTypes,
				managerId: estateManagersTable.managerId,
				adminId: estateManagersTable.adminId,
				rnbCode: estateManagersTable.rnbCode,
				factoryId: estateManagersTable.factoryId,
				createdAtBlock: estateManagersTable.createdAtBlock,
				createdAtTransactionHash: estateManagersTable.createdAtTransactionHash,
				createdAtTimestamp: estateManagersTable.createdAtTimestamp,
				moduleName: modulesTable.moduleName,
				admin: {
					id: adminIdAlias.id,
					walletAddress: adminIdAlias.walletAddress,
					firstName: adminIdAlias.firstName,
					lastName: adminIdAlias.lastName,
				},
				manager: {
					id: managerIdAlias.id,
					walletAddress: managerIdAlias.walletAddress,
					firstName: managerIdAlias.firstName,
					lastName: managerIdAlias.lastName,
				},
			})
			.from(estateManagersTable)
			.leftJoin(adminIdAlias, eq(estateManagersTable.adminId, adminIdAlias.id))
			.leftJoin(managerIdAlias, eq(estateManagersTable.managerId, managerIdAlias.id))
			.leftJoin(userInterventionAccessDocumentTable, eq(userInterventionAccessDocumentTable.estateManagerId, estateManagersTable.id))
			.leftJoin(interventionsTable, eq(interventionsTable.estateManagerId, estateManagersTable.id))
			.leftJoin(modulesTable, eq(modulesTable.estateManagerId, estateManagersTable.id))
			.where(
				or(
					and(eq(estateManagersTable.adminId, userId)),
					and(eq(estateManagersTable.managerId, userId)),
					and(eq(interventionsTable.createdBy, userId)),
					and(eq(userInterventionAccessDocumentTable.userId, userId), eq(userInterventionAccessDocumentTable.hasAccess, true))
				)
			)

		const serializedData = serializeBigInt(network)

		return NextResponse.json(serializedData)
	} catch (error) {
		console.error('Error fetching all networl:', error)
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
	}
}
