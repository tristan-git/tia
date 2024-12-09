'use server'

import { db } from '@/drizzle/db'
import { sql } from 'drizzle-orm'
import { mintedNFTsTable, usersTable } from '@/drizzle/schema'

export async function createNft(nftData: {
	tokenId: bigint
	estateManagerId: string
	fromAddress: string
	metadataURI: string
	transactionHash?: string
	town: string
	address: string
	img: string
}) {
	const user = await db
		.select({ id: usersTable.id })
		.from(usersTable)
		.where(sql`LOWER(${usersTable.walletAddress}) = LOWER(${nftData.fromAddress})`)

	const nextTokenId = BigInt(nftData.tokenId) + BigInt(1)

	await db.insert(mintedNFTsTable).values({
		tokenId: nextTokenId,
		estateManagerId: nftData.estateManagerId,
		ownerAddress: user[0].id,
		metadataURI: nftData.metadataURI,
		mintedBy: user[0].id,
		transactionHash: nftData.transactionHash || null,
		createdAtTimestamp: new Date(),
		address: nftData.address,
		town: nftData.town,
		img: nftData.img,
	})
}
