'use client'

import React, { useState } from 'react'

import { useAccount, useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import AllNft from './allNft'
import AddEstate from './createNft'
import { useIsManager } from '@/hooks/role/useIsManager'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

type MyEstatesProps = { idEstate: `0x${string}` }

const MyEstates = ({ idEstate }: MyEstatesProps) => {
	const { address } = useAccount()
	const isManager = useIsManager(address, idEstate) as boolean

	const { data: rnbCode } = useReadContract({
		abi: EstateManagerArtifact.abi,
		address: idEstate,
		functionName: 'getRnbCode',
	})

	const { data: nextTokenId } = useReadContract({
		abi: EstateManagerArtifact.abi,
		address: idEstate,
		functionName: 'getNextTokenId',
	})

	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='space-y-1'>
					<h2 className='text-2xl font-semibold tracking-tight'>{`Votre batiement RNB : ${rnbCode}`}</h2>
					<p className='text-sm text-muted-foreground'>Manager vos bien immobillier ici</p>
				</div>
				<AddEstate idEstate={idEstate} rnbCode={rnbCode} tokenId={nextTokenId} disabled={!isManager} />
			</div>

			{!isManager && (
				<Alert className='mb-6'>
					<InfoIcon className='h-4 w-4' />
					<AlertTitle className='font-bold'>Information</AlertTitle>
					<AlertDescription className='text-xs'>Vous n'ête pas manager du bien, vous ne pouvez pas ajouter de bâtiment</AlertDescription>
				</Alert>
			)}

			<AllNft idEstate={idEstate} />
		</>
	)
}

export default MyEstates
