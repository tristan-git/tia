import InterventionByNft from './_section'

import { db } from '@/drizzle/db'
import { eq, sql } from 'drizzle-orm'
import { mintedNFTsTable, usersTable } from '@/drizzle/schema'

export default async function Interventions({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id

	const nft = await db.select().from(mintedNFTsTable).where(eq(mintedNFTsTable.id, id))

	return (
		<>
			{nft?.length ? (
				<div className='container max-w-screen-xl p-4 overflow-x-hidden'>
					<InterventionByNft idNft={id as `0x${string}`} dataNft={nft[0]} />
				</div>
			) : (
				<p>N'existe pas</p>
			)}
		</>
	)
}
