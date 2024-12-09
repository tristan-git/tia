import { db } from '@/drizzle/db'
import { eq } from 'drizzle-orm'
import { interventionsTable } from '@/drizzle/schema'
import { NextResponse } from 'next/server'

// Fonction pour convertir les BigInt
function serializeBigInt(obj: any) {
	return JSON.parse(JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value)))
}

export async function POST(req: any) {
	try {
		const body = await req.json()
		const { currentAccount, idEstate, tokenId } = body

		const interventionsByNft = await db.select().from(interventionsTable).where(eq(interventionsTable.estateManagerId, idEstate))
		console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')
		console.log(interventionsByNft)

		if (!interventionsByNft?.length) {
			return NextResponse.json({ data: [] }, { status: 200 })
		}

		const serializedData = serializeBigInt(interventionsByNft)

		return NextResponse.json({ data: serializedData }, { status: 200 })
	} catch (error) {
		console.error('Erreur de connexion au réseau:', error)
		return NextResponse.json({ message: 'Erreur de connexion au réseau', error: error?.message }, { status: 500 })
	}
}
