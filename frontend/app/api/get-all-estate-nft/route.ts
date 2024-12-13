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

		// 1 = Admin | 2 gestionnaire | 3 prestataire | 4 lecteur
		const role = user?.[0].accountRoleId

		const managerAlias = aliasedTable(usersTable, 'managerId')
		const nfts = await db
			// .selectDistinct({
			.selectDistinctOn([mintedNFTsTable.id], {
				nftId: mintedNFTsTable.id,
				tokenId: mintedNFTsTable.tokenId,
				metadataURI: mintedNFTsTable.metadataURI,
				createdAtTimestamp: mintedNFTsTable.createdAtTimestamp,
				address: mintedNFTsTable.address,
				town: mintedNFTsTable.town,
				img: mintedNFTsTable.img,
				role: sql`CASE 
                WHEN ${mintedNFTsTable.ownerAddress} = ${userId} THEN 'owner'
                WHEN ${userModuleAccessTable.authorizedAddress} = ${userId} THEN 'authorized'
                ELSE NULL 
            END`.as('role'),
				estateManager: {
					id: estateManagersTable.id,
					adminId: estateManagersTable.adminId,
					managerId: estateManagersTable.managerId,
					rnbCode: estateManagersTable.rnbCode,
					networkTypes: estateManagersTable.networkTypes,
					factoryId: estateManagersTable.factoryId,
					createdAtBlock: estateManagersTable.createdAtBlock,
					createdAtTransactionHash: estateManagersTable.createdAtTransactionHash,
					createdAtTimestamp: estateManagersTable.createdAtTimestamp,
					managerDetails: {
						firstName: managerAlias.firstName,
						lastName: managerAlias.lastName,
						walletAddress: managerAlias.walletAddress,
						accountRoleId: managerAlias.accountRoleId,
					},
				},
				interventionCount: sql`(
                SELECT COUNT(*)
                FROM ${interventionsTable}
                WHERE ${interventionsTable.tokenId} = ${mintedNFTsTable.tokenId}
                  AND ${interventionsTable.estateManagerId} = ${mintedNFTsTable.estateManagerId}
                  AND ${interventionsTable.createdBy} = ${userId}
            )`.as('interventionCount'),
				documentCount: sql`(
                SELECT COUNT(*)
                FROM ${documentsTable}
                INNER JOIN ${userInterventionAccessDocumentTable}
                    ON ${documentsTable.interventionId} = ${userInterventionAccessDocumentTable.interventionId}
                WHERE ${userInterventionAccessDocumentTable.userId} = ${userId}
                  AND ${userInterventionAccessDocumentTable.hasAccess} = true
                  AND ${documentsTable.interventionId} IN (
                      SELECT ${interventionsTable.id}
                      FROM ${interventionsTable}
                      WHERE ${interventionsTable.tokenId} = ${mintedNFTsTable.tokenId}
                        AND ${interventionsTable.estateManagerId} = ${mintedNFTsTable.estateManagerId}
                  )
            )`.as('documentCount'),
			})
			.from(mintedNFTsTable)
			.leftJoin(estateManagersTable, eq(mintedNFTsTable.estateManagerId, estateManagersTable.id))
			.leftJoin(managerAlias, eq(estateManagersTable.managerId, managerAlias.id))
			.leftJoin(
				userModuleAccessTable,
				and(
					eq(userModuleAccessTable.tokenId, mintedNFTsTable.tokenId),
					eq(userModuleAccessTable.estateManagerId, mintedNFTsTable.estateManagerId)
				)
			)
			.where(
				or(
					eq(mintedNFTsTable.ownerAddress, userId),
					eq(userModuleAccessTable.authorizedAddress, userId),
					sql`EXISTS (
                    SELECT 1
                    FROM ${userInterventionAccessDocumentTable}
                    INNER JOIN ${interventionsTable}
                        ON ${userInterventionAccessDocumentTable.interventionId} = ${interventionsTable.id}
                    WHERE ${userInterventionAccessDocumentTable.userId} = ${userId}
                      AND ${userInterventionAccessDocumentTable.hasAccess} = true
                      AND ${interventionsTable.tokenId} = ${mintedNFTsTable.tokenId}
                      AND ${interventionsTable.estateManagerId} = ${mintedNFTsTable.estateManagerId}
                )`
				)
			)
			.groupBy(
				mintedNFTsTable.id,
				estateManagersTable.id,
				userModuleAccessTable.authorizedAddress,
				managerAlias.id
				// userInterventionAccessDocumentTable.interventionId,
				//interventionsTable.tokenId
			)

		const serializedData = serializeBigInt(nfts)

		// console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')
		// console.log('nftsOwned')
		// console.log(nfts)

		return NextResponse.json(serializedData)
	} catch (error) {
		console.error('Error fetching all nft:', error)
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
	}
}
