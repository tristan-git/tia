'use client'

import React, { useCallback, useMemo, useEffect } from 'react'
import AddEstate from './addEstate'
import { useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'

type MyEstatesProps = { idEstate: `0x${string}` }

const MyEstates = ({ idEstate }: MyEstatesProps) => {
	const { data: rnbCode } = useReadContract({
		abi: EstateManagerArtifact.abi,
		address: idEstate,
		functionName: 'getRnbCode',
	})

	return (
		<div className=''>
			code RNB : {`${rnbCode}`}
			<AddEstate idEstate={idEstate} rnbCode={rnbCode} />
		</div>
	)
}

export default MyEstates
