'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { artifactMyNFTWithRoles } from '@/constants/artifacts/MyNFTWithRoles'
import MintPage from './MintPage'
import TestAPI from './TestApi'
import GenerateSignature from './GenerateSignature'

const contractAddress = '0x5E5ACcadbC61562eB6f2b8Abdb67B3AD845c93F1'

export default function VotesPage() {
	const [tokenId, setTokenId] = useState('')
	const [userAddress, setUserAddress] = useState('')
	const [role, setRole] = useState('')
	const [status, setStatus] = useState('')

	const assignRole = async () => {
		if (typeof window.ethereum !== 'undefined') {
			try {
				const provider = new ethers.BrowserProvider(window.ethereum)
				const signer = await provider.getSigner()
				const contract = new ethers.Contract(contractAddress, artifactMyNFTWithRoles.abi, signer)
				console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')
				console.log(tokenId, userAddress, parseInt(role))
				const transaction = await contract.assignRole(parseInt(tokenId), userAddress, parseInt(role))
				console.log('transaction')
				console.log(transaction)
				await transaction.wait()

				setStatus('Role assigned successfully!')
			} catch (error) {
				console.error('Error assigning role:', error)
				setStatus('Failed to assign role.')
			}
		} else {
			alert('MetaMask is not installed')
		}
	}

	return (
		<>
			<div>
				<input type='text' value={tokenId} onChange={(e) => setTokenId(e.target.value)} placeholder='Enter token ID' />
				<input type='text' value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder='Enter user address' />
				<select value={role} onChange={(e) => setRole(e.target.value)}>
					<option value=''>Select role</option>
					<option value='2'>Manager</option>
					<option value='3'>Intervenant</option>
				</select>
				<button onClick={assignRole}>Assign Role</button>
				{status && <p>{status}</p>}
			</div>

			<MintPage />
			{/* <TestAPI /> */}
			<GenerateSignature />
		</>
	)
}
