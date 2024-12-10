'use client'

import React, { useState } from 'react'

import { useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import AllNft from './allNft'
import AddEstate from './createNft'

type MyEstatesProps = { idEstate: `0x${string}` }

const MyEstates = ({ idEstate }: MyEstatesProps) => {
	const [selectedNft, setSelectedNft] = useState(null)

	const { data: rnbCode } = useReadContract({
		abi: EstateManagerArtifact.abi,
		address: idEstate,
		functionName: 'getRnbCode',
	})

	// TODO ????????
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
				<AddEstate idEstate={idEstate} rnbCode={rnbCode} tokenId={nextTokenId} />
			</div>

			<AllNft idEstate={idEstate} setSelectedNft={setSelectedNft} selectedNft={selectedNft} />
		</>
	)
}

export default MyEstates
