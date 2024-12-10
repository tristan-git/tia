import { NextResponse } from 'next/server'
import { getManagerEstateNft } from '@/actions/manager/getManagerEstateNft'

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const { currentAccount, idEstate } = await request.json()

		const data = await getManagerEstateNft({ currentAccount, idEstate })

		return NextResponse.json(data)
	} catch (error) {
		console.error('Error fetching estate managers nft:', error)
		return NextResponse.json({ error: 'Error fetching estate managers nft' }, { status: 500 })
	}
}
