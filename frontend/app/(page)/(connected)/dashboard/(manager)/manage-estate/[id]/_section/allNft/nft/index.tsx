import React, { useCallback, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import PermissionNft from './permissionNft'

type NftProps = {
	dataNft: any
	setSelectedNft: any
	selectedNft: any
}

const Nft = ({ dataNft, setSelectedNft, selectedNft }: NftProps) => {
	// {
	//     "id": 50,
	//     "tokenId": "25",
	//     "estateManagerId": "0x155dfdcbb037b853580c1c8671d0c52b767c58bd",
	//     "ownerAddress": 6,
	//     "metadataURI": "https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/0x155dfdcbb037b853580c1c8671d0c52b767c58bd/24/metadata.json",
	//     "createdAtTimestamp": "2024-12-08T10:59:23.856Z",
	//     "mintedBy": 6,
	//     "transactionHash": "0x093db860d0ce8193966ebd1ce7801b8ee7b9b7afe5bcfc761e6125390c6e00fd",
	//     "address": "dsdsf",
	//     "town": "sdf",
	//     "img": "https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/0x155dfdcbb037b853580c1c8671d0c52b767c58bd/24/57f048b911192f6cea1b7aa9cdca8e4b26424fc06168236c1918dd6d1a5b82c6.png"
	// }
	return (
		<Card className=''>
			{selectedNft == dataNft?.tokenId && 'selectioner'}
			<CardHeader>
				<CardTitle>{`#${dataNft?.tokenId}`}</CardTitle>
				<CardDescription>Deploy your...</CardDescription>
			</CardHeader>
			<Image src={dataNft?.img} width={300} height={150} className='object-cover h-24 w-96' />
			<CardContent>
				<p>{dataNft?.address}</p>
				<p>{dataNft?.town}</p>
			</CardContent>
			<CardFooter className='flex justify-between'>
				<PermissionNft idEstate={dataNft?.estateManagerId} rnbCode={dataNft?.rnbCode} tokenId={dataNft?.tokenId} />

				<Button onClick={() => setSelectedNft(dataNft?.tokenId)}>Selectionner</Button>
			</CardFooter>
		</Card>
	)
}

export default Nft
