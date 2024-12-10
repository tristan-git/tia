import { NextResponse, type NextRequest } from 'next/server'
import { put } from '@vercel/blob'

function getFileExtension(filename) {
	const parts = filename.split('.')
	return parts.length > 1 ? parts.pop().toLowerCase() : '' // Returns the extension or an empty string
}

export async function POST(request: NextRequest) {
	try {
		// Parse form data
		const formData = await request.formData()
		const file = formData.get('file')
		const town = formData.get('title')
		const idEstate = formData.get('idEstate')
		const tokenId = formData.get('tokenId')
		const indexIntervention = formData.get('indexIntervention')

		if (!file) {
			return NextResponse.json({ error: 'No valid file received.' }, { status: 400 })
		}

		if (!town || !idEstate || !tokenId) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
		}

		// Convert file to ArrayBuffer
		const buffer = await file.arrayBuffer()

		// Compute SHA-256 hash
		const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
		const hashArray = Array.from(new Uint8Array(hashBuffer))
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

		// Generate a custom path
		const fileExtension = getFileExtension(file.name)
		const currentToken = parseInt(tokenId)

		const customPath = `${idEstate}/${currentToken}/interventions/${indexIntervention}/${hashHex}.${fileExtension}`

		// Upload the file
		const blob = await put(customPath, buffer, {
			access: 'public',
			addRandomSuffix: false,
		})

		return NextResponse.json({ success: true, blob, hashHex, fileExtension }, { status: 200 })
	} catch (error) {
		console.error('Error uploading file:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
