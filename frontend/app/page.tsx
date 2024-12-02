'use client'

import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
	const { address: currentAccount, status, isConnecting, isDisconnected, isReconnecting } = useAccount()
	const router = useRouter()

	// console.log({ address: currentAccount, status, isConnecting, isDisconnected, isReconnecting })

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch('/api/users/role', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ currentAccount }),
				})

				if (!res.ok) {
					throw new Error(`Erreur HTTP ! statut : ${res.status}`)
				}

				const { data } = await res.json()
				// router.push('/not-found')
				console.log(data)
			} catch (error) {
				console.error('Erreur lors de la récupération des données:', error.message)
			}
		}

		if (currentAccount) {
			getUser()
		}
	}, [currentAccount, router])

	return <></>
}
