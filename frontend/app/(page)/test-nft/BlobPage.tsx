'use client'

import React from 'react'
import Image from 'next/image'
import fetchProtectedBlob from './fetchProtectedBlob'

export default function BlobPage() {
	const handleDownload = async () => {
		try {
			const tokenId = 1 // ID du NFT
			const filename = '86c703c2f75f4cb8082e6f2986ff9d75b8c15279beb483554adc0b6eaa4de9b4'
			await fetchProtectedBlob(tokenId, filename)
		} catch (error) {
			console.error('Erreur lors du téléchargement du fichier:', error.message)
		}
	}

	return (
		<div>
			<h1>Téléchargez votre fichier Blob sécurisé</h1>
			<button onClick={handleDownload}>Télécharger le fichier</button>

			<Image
				src='https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/86c703c2f75f4cb8082e6f2986ff9d75b8c15279beb483554adc0b6eaa4de9b4.png'
				width={200}
				height={200}
				alt='Picture of the author'
			/>
		</div>
	)
}
