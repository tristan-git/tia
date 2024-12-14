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
	const { address: currentAccount, status } = useAccount()
	const [userAccount, setUserAccount] = useState()
	const router = useRouter()

	const roleToRoute = {
		admin: '/dashboard/network-estate',
		manager: '/dashboard/network-estate',
		prestataire: '/dashboard/network-estate',
		viewer: '/dashboard/network-estate',
	}

	useEffect(() => {
		const getUser = async () => {
			try {
				if (status == 'connected') {
					const res = await fetch('/api/users/role', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ currentAccount }),
					})

					if (!res.ok) throw new Error(`Erreur HTTP ! statut : ${res.status}`)

					const { data } = await res.json()

					if (data?.length) {
						const user = data[0]
						setUserAccount(user)

						const role = user.roleName
						const targetRoute = roleToRoute[role]
						const savedRoute = localStorage.getItem('targetRoute')

						if (savedRoute) {
							router.push(
								role == 'admin' && savedRoute == '/dashboard/admin-module'
									? '/dashboard/admin-module'
									: savedRoute == '/dashboard/admin-module'
									? targetRoute
									: savedRoute
							)
						} else {
							console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')
							localStorage.setItem('targetRoute', targetRoute)
							router.push(targetRoute)
						}
					}
				} else {
					router.push('/signup')
				}
			} catch (error) {
				console.error('Erreur lors de la récupération des données:', error.message)
			}
		}

		getUser()
	}, [router, currentAccount, status])

	return <BlockchainContext.Provider value={{ userAccount, currentAccount }}>{children}</BlockchainContext.Provider>
}

export default BlockchainProvider
