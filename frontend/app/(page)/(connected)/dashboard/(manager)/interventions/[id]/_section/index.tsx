'use client'

import React, { useState } from 'react'

import { useReadContract } from 'wagmi'
import { EstateManagerArtifact } from '@/constants/artifacts/EstateManager'
import { useGetManagerEstateNft } from '@/hooks/queries/manager/useGetManagerEstateNft'
import InterventionsByNft from './interventionsByNft'
import CreateIntervention from './createIntervention'
// import AllNft from './allNft'
// import AddEstate from './createNft'

type MyEstatesProps = {
	idNft: `0x${string}`
	dataNft: any
}

const InterventionByNft = ({ idNft, dataNft }: MyEstatesProps) => {
	// const [selectedNft, setSelectedNft] = useState(null)

	// const { data: rnbCode } = useReadContract({
	// 	abi: EstateManagerArtifact.abi,
	// 	address: idEstate,
	// 	functionName: 'getRnbCode',
	// })

	// const { data: tokenId } = useReadContract({
	// 	abi: EstateManagerArtifact.abi,
	// 	address: idEstate,
	// 	functionName: 'getTokenId',
	// })

	console.log(dataNft)

	// {
	// 	id: 1,
	// 	tokenId: 2n,
	// 	estateManagerId: '0x2a15c9ac8c57495d27f65541a7abe5f9596c5fbb',
	// 	ownerAddress: 2,
	// 	metadataURI: 'https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/0x2a15c9ac8c57495d27f65541a7abe5f9596c5fbb/2/metadata.json',
	// 	createdAtTimestamp: 2024-12-08T14:41:48.150Z,
	// 	mintedBy: 2,
	// 	transactionHash: '0xea08f0aae70d7f82ccf31ce6baa9ba7cc1181fb4e5dfbb52cfa4f0e70682b756',
	// 	address: '13 rue de la catinierre',
	// 	town: 'Blois',
	// 	img: 'https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/0x2a15c9ac8c57495d27f65541a7abe5f9596c5fbb/2/3736858fbe495726973671e88c78c619ac38c81b6a37d9d663fcd24ab2b08b7b.png'
	//   }
	// ]

	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='space-y-1'>
					<h2 className='text-2xl font-semibold tracking-tight'>{`Intervention du Batiement #${idNft}`}</h2>
					<p className='text-sm text-muted-foreground'>Manager vos bien immobillier ici</p>
				</div>
				<CreateIntervention idEstate={dataNft?.estateManagerId} tokenId={dataNft?.tokenId} />
			</div>

			<InterventionsByNft idEstate={dataNft?.estateManagerId} tokenId={dataNft?.tokenId} />
		</>
	)
}

export default InterventionByNft
