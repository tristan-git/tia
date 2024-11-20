'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { artifactMyNFTWithRoles } from '@/constants/artifacts/MyNFTWithRoles'; // Assurez-vous que l'ABI est correctement importée

const contractAddress = '0x5E5ACcadbC61562eB6f2b8Abdb67B3AD845c93F1'; // Remplacez par l'adresse de votre contrat déployé

export default function MintPage() {
    const [recipient, setRecipient] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [tokenURI, setTokenURI] = useState('');
    const [status, setStatus] = useState('');

    const mintNFT = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Demande à l'utilisateur de se connecter à MetaMask
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, artifactMyNFTWithRoles.abi, signer);

                // Appel de la fonction mintNFT du contrat
                const transaction = await contract.mintNFT(recipient, tokenId, tokenURI);
                await transaction.wait();

                setStatus(`Minting successful! Token ID: ${tokenId}`);
            } catch (error) {
                console.error('Error minting NFT:', error);
                setStatus('Minting failed. Please check the console for details.');
            }
        } else {
            alert('MetaMask is not installed');
        }
    };

    // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // 999
    // sdf

    return (
        <div>
            <h1>Mint a New NFT</h1>
            <input
                type='text'
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder='Enter recipient address'
            />
            <input
                type='text'
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder='Enter token ID'
            />
            <input
                type='text'
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
                placeholder='Enter token URI'
            />
            <button onClick={mintNFT}>Mint NFT</button>
            {status && <p>{status}</p>}
        </div>
    );
}
