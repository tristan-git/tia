'use client'

import { createContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'

/////////////////////////////////////////////////////////
//  CONTEXT
/////////////////////////////////////////////////////////

interface BlockchainContextType {
	userAccount: any
	currentAccount: any
}

export const BlockchainContext = createContext<BlockchainContextType | null>(null)

/////////////////////////////////////////////////////////
// PROVIDER
/////////////////////////////////////////////////////////

const BlockchainProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	const { address: currentAccount, status, isConnecting, isDisconnected, isReconnecting } = useAccount()
	const [userAccount, setUserAccount] = useState()
	const router = useRouter()

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

				if (data?.length) {
					setUserAccount(data[0])
					router.push('/dashboard/manage-estate')
				}
			} catch (error) {
				console.error('Erreur lors de la récupération des données:', error.message)
			}
		}

		if (currentAccount) {
			getUser()
		} else {
			router.push('/signup')
		}
	}, [currentAccount, router])

	return <BlockchainContext.Provider value={{ userAccount, currentAccount }}>{children}</BlockchainContext.Provider>
}

export default BlockchainProvider
