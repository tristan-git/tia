'use client'

import React from 'react'

import { useAccount } from 'wagmi'
import InterventionsByNft from './interventionsByNft'
import CreateIntervention from './createIntervention'
import { useHaveAccessModule } from '@/hooks/role/usehaveAccessModule'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

type MyEstatesProps = {
	idNft: `0x${string}`
	dataNft: any
	addressInterventionManager: any
}

const InterventionByNft = ({ idNft, dataNft, addressInterventionManager }: MyEstatesProps) => {
	const { address: currentAccount } = useAccount()

	const haveAccessModule = useHaveAccessModule({
		contractAddress: dataNft?.estateManagerId,
		tokenId: dataNft?.tokenId,
		userAddress: currentAccount as `0x${string}`,
	})

	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='space-y-1'>
					<h2 className='text-2xl font-semibold tracking-tight'>{`Intervention du bâtiment #${idNft}`}</h2>
					<p className='text-sm text-muted-foreground uppercase'>{`Localisation : ${dataNft?.town} - ${dataNft?.address}`}</p>
				</div>
				<CreateIntervention
					idEstate={dataNft?.estateManagerId}
					tokenId={dataNft?.tokenId}
					addressInterventionManager={addressInterventionManager}
					disabled={!haveAccessModule}
				/>
			</div>

			{!haveAccessModule && (
				<Alert className='mb-6'>
					<InfoIcon className='h-4 w-4' />
					<AlertTitle className='font-bold'>Information</AlertTitle>
					<AlertDescription className='text-xs'>Vous n'avez pas access au module intervention </AlertDescription>
				</Alert>
			)}

			<InterventionsByNft idEstate={dataNft?.estateManagerId} tokenId={dataNft?.tokenId} />
		</>
	)
}

export default InterventionByNft
