import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

function getFileExtension(filename: any) {
	const parts = filename.split('.')
	return parts.length > 1 ? parts.pop().toLowerCase() : '' // Retourne l'extension ou une chaîne vide
}

export async function POST(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url)
	const filename = searchParams.get('filename')

	// Calculer un hash SHA-256 pour le contenu du fichier (optionnel)
	const buffer = await request.arrayBuffer()
	const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

	// Générer un nom unique
	const customFilename = `${hashHex}.${getFileExtension(filename)}`

	// Télécharger le fichier
	const blob = await put(customFilename, buffer, {
		access: 'public',
		addRandomSuffix: false,
	})

	return NextResponse.json(blob)
}
