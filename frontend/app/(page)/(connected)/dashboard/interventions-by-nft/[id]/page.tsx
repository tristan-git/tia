import InterventionByNft from './_section'

import { db } from '@/drizzle/db'
import { eq } from 'drizzle-orm'
import { mintedNFTsTable, modulesTable } from '@/drizzle/schema'

export default async function Interventions({ params }: { params: Promise<{ id: string }> }) {
	const id = (await params).id
	const nft = await db.select().from(mintedNFTsTable).where(eq(mintedNFTsTable.id, id))
	const estateManagerId = nft?.[0]?.estateManagerId
	const addressInterventionManager = await db.select().from(modulesTable).where(eq(modulesTable.estateManagerId, estateManagerId))

	return (
		<>
			{nft?.length ? (
				<div className='container max-w-screen-xl p-4 overflow-x-hidden'>
					<InterventionByNft
						idNft={id as `0x${string}`}
						dataNft={nft[0]}
						addressInterventionManager={addressInterventionManager?.[0]?.id}
					/>
				</div>
			) : (
				<p>N'existe pas</p>
			)}
		</>
	)
}
