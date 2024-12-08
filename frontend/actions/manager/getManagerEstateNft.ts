'use server'

import { db } from '@/drizzle/db'
import { estateManagersTable, usersTable, modulesTable, mintedNFTsTable } from '@/drizzle/schema'
import { eq, or } from 'drizzle-orm'

// Fonction pour convertir les BigInt
function serializeBigInt(obj) {
	return JSON.parse(JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value)))
}

export async function getManagerEstateNft({ currentAccount, idEstate }) {
	const mintedNFTs = await db.select().from(mintedNFTsTable).where(eq(mintedNFTsTable.estateManagerId, idEstate))

	// Convertir les BigInt en string avant de retourner
	const serializedData = serializeBigInt(mintedNFTs)

	return serializedData
}
