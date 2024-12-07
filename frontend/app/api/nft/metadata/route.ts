import { NextResponse, type NextRequest } from 'next/server'
import { pinata } from '@/utils/config'

export async function POST(request: NextRequest) {
	try {
		const metadata = await request.json()
		const uploadData = await pinata.upload.json(metadata)
		const url = `ipfs://${uploadData.cid}`
		return NextResponse.json({ url }, { status: 200 })
	} catch (error) {
		console.error('Error uploading metadata:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
