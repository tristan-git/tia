import { PutBlobResult } from '@vercel/blob'
import { ethers } from 'ethers'

async function fetchProtectedBlob(tokenId, filename) {
	const provider = new ethers.BrowserProvider(window.ethereum)
	await window.ethereum.request({ method: 'eth_requestAccounts' })
	const signer = await provider.getSigner()
	const userAddress = await signer.getAddress()

	// Générer une signature
	const address = await signer.getAddress()
	const message = `Access blob for token ID ${tokenId}`
	const signature = await signer.signMessage(message)

	// Appeler l'API pour récupérer le fichier
	const response = await fetch(`/api/protected-blob`, {
		method: 'POST',
		// headers: {
		// 	'Content-Type': 'application/json',
		// 	// 'message': message,
		// 	// 'signature': signature,
		// 	// 'address': address,
		// 	// 'tokenId': String(tokenId),
		// },
		body: JSON.stringify({ message, signature, address, tokenId, filename }),
	})

	if (response.ok) {
		const newBlob = (await response.json()) as PutBlobResult

		console.log(newBlob)

		//         fetch("/foo", { method: "POST" })
		//   .then((res) => res.blob())
		//   .then((blob) => URL.createObjectURL(blob))
		//   .then((blob) => {
		//     let img = document.createElement("img");
		//     img.src = blob;
		//     document.body.appendChild(img);
		//   });
	} else {
		const error = await response.json()
		console.error('Erreur lors de la récupération du fichier:', error)
		throw new Error(error.message)
	}
}

export default fetchProtectedBlob
