import { NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { artifactMyNFTWithRoles } from '@/constants/artifacts/MyNFTWithRoles'

export async function POST(req) {
	try {
		const body = await req.json()
		const { message, signature, address, tokenId, contractAddress } = body

		console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')

		const provider = new ethers.JsonRpcProvider('https://testnet.skalenodes.com/v1/giant-half-dual-testnet')
		// const network = await provider.getNetwork()

		const contract = new ethers.Contract(contractAddress, artifactMyNFTWithRoles.abi, provider)
		const userRoleBigInt = await contract.getRole(tokenId, address)
		const userRole = Number(userRoleBigInt)

		if (userRole === 0) {
			return NextResponse.json({ message: 'Access denied: No role assigned' }, { status: 403 })
		}

		// Vérifier la signature
		const recoveredAddress = ethers.verifyMessage(message, signature)

		if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
			let accessMessage
			switch (userRole) {
				case 1:
					accessMessage = 'Full access granted (Owner)'
					break
				case 2:
					accessMessage = 'Manager access granted'
					break
				case 3:
					accessMessage = 'Intervenant access granted'
					break
				default:
					accessMessage = 'Access denied'
			}
			return NextResponse.json({ message: accessMessage }, { status: 200 })
		} else {
			return NextResponse.json({ message: 'Access denied: Invalid signature' }, { status: 403 })
		}
	} catch (error) {
		console.error('Erreur de connexion au réseau:', error)
		return NextResponse.json({ message: 'Erreur de connexion au réseau', error: error?.message }, { status: 500 })
	}
}
