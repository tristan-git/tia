'use client'

import React, { useState } from 'react'

import { useAccount, useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { useGetManagerEstateNft } from '@/hooks/queries/manager/useGetManagerEstateNft'
import InterventionsByNft from './interventionsByNft'
import CreateIntervention from './createIntervention'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'

type MyEstatesProps = {
	idNft: `0x${string}`
	dataNft: any
	addressInterventionManager: any
}

const InterventionByNft = ({ idNft, dataNft, addressInterventionManager }: MyEstatesProps) => {
	const { address: currentAccount } = useAccount()

	// const { data } = useReadContract({
	// 	abi: InterventionManagerArtifact.abi,
	// 	address: addressInterventionManager,
	// 	functionName: 'getInterventions',
	// 	args: [BigInt(dataNft?.tokenId), currentAccount],
	// 	account: currentAccount,
	// })
	// const { data: tt } = useReadContract({
	// 	abi: InterventionManagerArtifact.abi,
	// 	address: addressInterventionManager,
	// 	functionName: 'getTest',
	// 	account: currentAccount,
	// })

	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='space-y-1'>
					<h2 className='text-2xl font-semibold tracking-tight'>{`Intervention du Batiement #${idNft}`}</h2>
					<p className='text-sm text-muted-foreground'>Manager vos bien immobillier ici</p>
				</div>
				<CreateIntervention
					idEstate={dataNft?.estateManagerId}
					tokenId={dataNft?.tokenId}
					addressInterventionManager={addressInterventionManager}
				/>
			</div>

			<InterventionsByNft idEstate={dataNft?.estateManagerId} tokenId={dataNft?.tokenId} />
		</>
	)
}

export default InterventionByNft
