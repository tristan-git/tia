'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RocketIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPublicClient, http, parseAbiItem, formatEther } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
	chain: mainnet,
	transport: http('https://mainnet.skalenodes.com/v1/green-giddy-denebola'),
})

const formatTimeStamp = (timestampBigInt) => {
	const timestamp = Number(timestampBigInt) // Convertir BigInt en Number
	const date = new Date(timestamp * 1000) // Multiplier par 1000 pour convertir en millisecondes
	return date.toISOString()
}

export default function Home() {
	const [events, setEvents] = useState([])
	useEffect(() => {
		//
		// ChestOpened(address indexed user, uint256 timestamp)

		const getInfos = async () => {
			const logs = await client.getLogs({
				address: '0x620655Ee8320bA51cf4cc06bf6a7C14022271764',
				event: parseAbiItem('event ChestOpened(address indexed, uint256)'),
				fromBlock: 15055227n,
				toBlock: 15055228n,
			})
			setEvents(logs)
		}
		getInfos()
	}, [])

	return (
		<div className='container mx-auto mt-8'>
			<div className='flex-col space-y-2'>
				{events?.map((event) => (
					<Alert key={crypto.randomUUID()}>
						<RocketIcon className='h-4 w-4' />
						<AlertTitle>event ChestOpened</AlertTitle>
						<AlertDescription>
							<p key={crypto.randomUUID()}>
								Adresse user : {event?.args?.[0]} - TimeStamp : {formatTimeStamp(event?.args?.[1])}
							</p>
						</AlertDescription>
					</Alert>
				))}
			</div>
		</div>
	)
}
