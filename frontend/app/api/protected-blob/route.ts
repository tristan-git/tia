import { artifactMyNFTWithRoles } from '@/constants/artifacts/MyNFTWithRoles'
import { ethers } from 'ethers'
import { NextResponse } from 'next/server'

const provider = new ethers.JsonRpcProvider('https://testnet.skalenodes.com/v1/giant-half-dual-testnet')
const contractAddress = '0x5E5ACcadbC61562eB6f2b8Abdb67B3AD845c93F1'
const contract = new ethers.Contract(contractAddress, artifactMyNFTWithRoles.abi, provider)

// export async function GET(request: Request, { params }: { params: Promise<{ team: string }> }) {
// 	const team = (await params).team
// }

export async function POST(request: Request): Promise<NextResponse> {
	console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')

	const { tokenId, message, signature, address, filename } = await request.json()

	// console.log({ signature, message, address, tokenId, filename })

	try {
		// Vérification de la signature
		const recoveredAddress = ethers.verifyMessage(message, signature)
		if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
			return NextResponse.json({ message: 'Access denied: Invalid signature' }, { status: 403 })
			// return new Response(JSON.stringify({ message: 'Access denied: Invalid signature' }), { status: 403 })
		}

		// Vérification du rôle de l'utilisateur
		const userRoleBigInt = await contract.getRole(tokenId, address)
		const userRole = Number(userRoleBigInt)

		if (userRole === 0) {
			return NextResponse.json({ message: 'Access denied: No role assigned' }, { status: 403 })
		}

		// URL publique du fichier sur Vercel Blob
		const blobUrl = `https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/${filename}.png`

		// Vérifier si le fichier existe
		const fileResponse = await fetch(blobUrl)
		const tmpBlob = await fileResponse.blob()

		const objectURL = URL.createObjectURL(tmpBlob)

		if (!fileResponse.ok) {
			return NextResponse.json({ message: 'File not found' }, { status: 404 })
		}

		return NextResponse.json({ blobUrl, status: 200 })

		// // return NextResponse.json(fileResponse)
		// const headers = new Headers()
		// headers.set('Content-Type', 'image/*')

		// // Retourner le contenu du fichier au client (streaming)
		// return new NextResponse(objectURL, { status: 200, statusText: 'OK', headers })
	} catch (error) {
		console.error('Erreur lors de la vérification:', error)
		return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
	}
}
