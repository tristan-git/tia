'use client'

import { useState } from 'react'

type AddFileProps = {
	setImageUrl: (url: string) => void
}

const AddFile = ({ setImageUrl }: AddFileProps) => {
	const [file, setFile] = useState<File | null>(null)
	const [uploading, setUploading] = useState(false)

	const uploadFileToPinata = async (): Promise<string> => {
		try {
			if (!file) {
				alert('Aucun fichier sélectionné')
				return ''
			}

			setUploading(true)
			const data = new FormData()
			data.append('file', file)

			const response = await fetch('/api/nft/files', {
				method: 'POST',
				body: data,
			})

			const { url } = await response.json()
			setImageUrl(url)
			setUploading(false)

			return url
		} catch (error) {
			console.error('Erreur lors de l’upload de l’image:', error)
			setUploading(false)
			throw new Error('Échec de l’upload de l’image')
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null
		setFile(selectedFile)
	}

	return (
		<div>
			<input type='file' onChange={handleChange} />
			<button type='button' disabled={uploading} onClick={uploadFileToPinata}>
				{uploading ? 'Uploading...' : 'Upload'}
			</button>
		</div>
	)
}

export default AddFile
