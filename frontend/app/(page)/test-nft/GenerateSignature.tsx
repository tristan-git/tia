'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { artifactMyNFTWithRoles } from '@/constants/artifacts/MyNFTWithRoles'

export default function GenerateSignature() {
	const [message, setMessage] = useState('Je confirme que je suis le propriétaire de cette adresse pour accéder au token ID 999')
	const [signature, setSignature] = useState('')
	const [address, setAddress] = useState('')
	const [tokenId, setTokenId] = useState(1)

	const getSignatureData = async () => {
		try {
			if (typeof window.ethereum !== 'undefined') {
				const provider = new ethers.BrowserProvider(window.ethereum)
				await window.ethereum.request({ method: 'eth_requestAccounts' })
				const signer = await provider.getSigner()
				const userAddress = await signer.getAddress()
				setAddress(userAddress)

				const userSignature = await signer.signMessage(message)
				setSignature(userSignature)

				// console.log('Message:', message)
				// console.log('Signature:', userSignature)
				// console.log('Address:', userAddress)
				// console.log('Token ID:', tokenId)
			} else {
				alert('MetaMask is not installed')
			}
		} catch (error) {
			console.error('Error generating signature:', error)
		}
	}

	/////////////////////////////////////////////////////////
	// comment
	/////////////////////////////////////////////////////////

	const [response, setResponse] = useState(null)
	const testAPI = async () => {
		const data = {
			message: message,
			signature: signature,
			address: address,
			tokenId: tokenId,
			contractAddress: '0x5E5ACcadbC61562eB6f2b8Abdb67B3AD845c93F1',
		}

		try {
			const res = await fetch('/api/verify-access', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			const result = await res.json()
			setResponse(result)
		} catch (error) {
			console.error('Error calling API:', error)
		}
	}

	// async function testConnection() {
	// 	try {
	// 		const provider = new ethers.JsonRpcProvider('https://testnet.skalenodes.com/v1/giant-half-dual-testnet')
	// 		const network = await provider.getNetwork()

	// 		const contract = new ethers.Contract('0x5E5ACcadbC61562eB6f2b8Abdb67B3AD845c93F1', artifactMyNFTWithRoles.abi, provider)
	// 		const userRole = await contract.getRole(1, '0x734cEf8774dEB4FD18DFe57f010b842941012BBB')
	// 		console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')
	// 		console.log(userRole)

	// 		console.log('Connected to network:', network)
	// 	} catch (error) {
	// 		console.error('Error connecting to the network:', error)
	// 	}
	// }

	// testConnection()

	return (
		<div>
			<h1>Generate and Sign Message</h1>
			<button onClick={getSignatureData}>Generate Signature</button>
			{address && (
				<div>
					<p>
						<strong>Address:</strong> {address}
					</p>
					<p>
						<strong>Message:</strong> {message}
					</p>
					<p>
						<strong>Signature:</strong> {signature}
					</p>
					<p>
						<strong>Token ID:</strong> {tokenId}
					</p>
				</div>
			)}

			<div>
				<button onClick={testAPI}>Test API</button>
				{response && <pre>{JSON.stringify(response, null, 2)}</pre>}
			</div>
		</div>
	)
}
