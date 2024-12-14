import React from 'react'
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
