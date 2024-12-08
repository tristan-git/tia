'use client'

import React from 'react'
// import AddEstate from './addEstate'
import { useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import AllNft from './allNft'
import AddEstate from './createNft'

type MyEstatesProps = { idEstate: `0x${string}` }

const MyEstates = ({ idEstate }: MyEstatesProps) => {
	const { data: rnbCode } = useReadContract({
		abi: EstateManagerArtifact.abi,
		address: idEstate,
		functionName: 'getRnbCode',
	})

	const {
		data: tokenId,
		isLoading,
		isError,
		error,
		failureReason,
	} = useReadContract({
		abi: EstateManagerArtifact.abi,
		address: idEstate,
		functionName: 'getTokenId',
	})

	return (
		<div className=''>
			code RNB : {`${rnbCode}`}
			<AddEstate idEstate={idEstate} rnbCode={rnbCode} tokenId={tokenId} />
			<AllNft idEstate={idEstate} />
		</div>
	)
}

export default MyEstates
