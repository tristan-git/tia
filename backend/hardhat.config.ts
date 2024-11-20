import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'
dotenv.config() // Chargement des variables d'environnement à partir du fichier .env

// Déployer le contrat sur Sepolia :
// yarn hardhat run ./scripts/deploy.js --network sepolia
// Vérifier le contrat sur Etherscan :
// yarn hardhat verify 0x8Ed1b0e488A472CbE19d967e0e8cA5Cbaed6854E --network sepolia

// Récupération des variables d'environnement
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const PRIVATE_KEY_CALYPSO = process.env.PRIVATE_KEY_CALYPSO || ''

const config: HardhatUserConfig = {
	defaultNetwork: 'hardhat',

	// Configuration de la version de Solidity
	solidity: {
		compilers: [
			{
				version: '0.8.28',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200, // Optimisation pour réduire le coût de gas
					},
				},
			},
			{
				version: '0.8.27',
				settings: {
					optimizer: {
						enabled: true,
						runs: 200, // Optimisation pour réduire le coût de gas
					},
				},
			},
		],
	},

	// Configuration des réseaux
	networks: {
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
			chainId: 11155111,
		},

		localhost: {
			url: 'http://127.0.0.1:8545',
			chainId: 31337,
		},

		// testnet Skale network
		calypso: {
			url: 'https://testnet.skalenodes.com/v1/giant-half-dual-testnet',
			chainId: 974399131,
			accounts: PRIVATE_KEY_CALYPSO ? [`0x${PRIVATE_KEY_CALYPSO}`] : [],
		},
	},

	// Configuration pour la vérification sur Etherscan
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,

		customChains: [
			{
				network: 'calypso',
				chainId: 974399131,
				urls: {
					apiURL: 'https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/api',
					browserURL: 'https://giant-half-dual-testnet.explorer.testnet.skalenodes.com/',
				},
			},
		],
	},

	// Configuration du gas reporter
	// gasReporter: {
	//   enabled: true,
	//   currency: 'USD', // Affiche les coûts en USD
	//   coinmarketcap: process.env.COINMARKETCAP_API_KEY, // Utiliser l'API de CoinMarketCap pour le taux de conversion (optionnel)
	// },

	// // Configuration des chemins personnalisés (optionnel)
	// paths: {
	//   sources: "./contracts",
	//   tests: "./test",
	//   cache: "./cache",
	//   artifacts: "./artifacts",
	// },
}

export default config
