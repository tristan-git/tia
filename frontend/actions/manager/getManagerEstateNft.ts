'use server'

import { db } from '@/drizzle/db'
import {
	estateManagersTable,
	usersTable,
	modulesTable,
	mintedNFTsTable,
	interventionsTable,
	documentsTable,
	userModuleAccessTable,
} from '@/drizzle/schema'
import { eq, or, sql, and } from 'drizzle-orm'
import { aliasedTable } from 'drizzle-orm'

// Fonction pour convertir les BigInt
function serializeBigInt(obj) {
	return JSON.parse(JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value)))
}

export async function getManagerEstateNft({ currentAccount, idEstate }) {
	const ownerAlias = aliasedTable(usersTable, 'owner')
	const mintedByAlias = aliasedTable(usersTable, 'mintedBy')

	const nftsWithDetails = await db
		.select({
			id: mintedNFTsTable.id,
			tokenId: mintedNFTsTable.tokenId,
			metadataURI: mintedNFTsTable.metadataURI,
			createdAtTimestamp: mintedNFTsTable.createdAtTimestamp,
			addressInterventionManager: mintedNFTsTable.addressInterventionManager,
			address: mintedNFTsTable.address,
			estateManagerId: mintedNFTsTable.estateManagerId,
			town: mintedNFTsTable.town,
			img: mintedNFTsTable.img,
			ownerDetails: {
				id: ownerAlias.id,
				walletAddress: ownerAlias.walletAddress,
				firstName: ownerAlias.firstName,
				lastName: ownerAlias.lastName,
			},
			mintedByDetail: {
				id: mintedByAlias.id,
				walletAddress: mintedByAlias.walletAddress,
				firstName: mintedByAlias.firstName,
				lastName: mintedByAlias.lastName,
			},
			modules: sql`COALESCE(
		jsonb_agg(jsonb_build_object(
		  'id', ${modulesTable.id},
		  'moduleName', ${modulesTable.moduleName},
		  'estateManagerId', ${modulesTable.estateManagerId}
		)) FILTER (WHERE ${modulesTable.id} IS NOT NULL), '[]'
	  )`.as('modules'),
			userModuleAccess: sql`COALESCE(
		jsonb_agg(jsonb_build_object(
		  'id', ${userModuleAccessTable.id},
		  'moduleName', ${userModuleAccessTable.moduleName},
		  'authorizedAddress', ${userModuleAccessTable.authorizedAddress},
		  'assignedAtTimestamp', ${userModuleAccessTable.assignedAtTimestamp},
		  'revokedAtTimestamp', ${userModuleAccessTable.revokedAtTimestamp}
		)) FILTER (
		  WHERE ${userModuleAccessTable.id} IS NOT NULL 
			AND ${userModuleAccessTable.estateManagerId} = ${mintedNFTsTable.estateManagerId}
		), '[]'
	  )`.as('userModuleAccess'),

			interventions: sql`COALESCE(
		jsonb_agg(DISTINCT jsonb_build_object(
			'id', ${interventionsTable.id},
			'indexIntervention', ${interventionsTable.indexIntervention},
			'title', ${interventionsTable.title},
			'isValidated', ${interventionsTable.isValidated},
			'validateFrom', ${interventionsTable.validateFrom},
			'createdAtTimestamp', ${interventionsTable.createdAtTimestamp},
			'createdBy', ${interventionsTable.createdBy},
			'documents', (
				SELECT COALESCE(
					jsonb_agg(DISTINCT jsonb_build_object(
						'id', ${documentsTable.id},
						'title', ${documentsTable.title},
						'documentHash', ${documentsTable.documentHash},
						'fileExtension', ${documentsTable.fileExtension},
						'createdAtTimestamp', ${documentsTable.createdAtTimestamp},
						'createdBy', ${documentsTable.createdBy}
					)), '[]'
				)
				FROM ${documentsTable}
				WHERE ${documentsTable.interventionId} = ${interventionsTable.id}
			)
		)) FILTER (WHERE ${interventionsTable.id} IS NOT NULL), '[]'
	)`.as('interventions'),
		})
		.from(mintedNFTsTable)
		.leftJoin(ownerAlias, eq(mintedNFTsTable.ownerAddress, ownerAlias.id))
		.leftJoin(mintedByAlias, eq(mintedNFTsTable.mintedBy, mintedByAlias.id))
		.leftJoin(modulesTable, eq(modulesTable.estateManagerId, mintedNFTsTable.estateManagerId))
		.leftJoin(
			interventionsTable,
			and(eq(mintedNFTsTable.tokenId, interventionsTable.tokenId), eq(mintedNFTsTable.estateManagerId, interventionsTable.estateManagerId))
		)
		.leftJoin(
			userModuleAccessTable,
			and(
				eq(userModuleAccessTable.tokenId, mintedNFTsTable.tokenId),
				eq(userModuleAccessTable.estateManagerId, mintedNFTsTable.estateManagerId)
			)
		)
		.where(eq(mintedNFTsTable.estateManagerId, idEstate))
		.groupBy(mintedNFTsTable.id, ownerAlias.id, mintedByAlias.id)

	// Convertir les BigInt en string avant de retourner
	const serializedData = serializeBigInt(nftsWithDetails)

	return serializedData
}
