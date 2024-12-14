import { NextResponse } from 'next/server'
import { getManagerEstate } from '@/actions/manager/getManagerEstate'

export async function GET() {
	try {
		const data = await getManagerEstate()

		return NextResponse.json(data)
	} catch (error) {
		console.error('Error fetching estate managers:', error)
		return NextResponse.json({ error: 'Failed to fetch estate managers' }, { status: 500 })
	}
}
