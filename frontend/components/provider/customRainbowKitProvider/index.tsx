'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { skaleCalypsoTestnet } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import BlockchainProvider from '../blockchainProvider'
// import { structuralSharing } from 'wagmi/query'

export const config = getDefaultConfig({
	appName: 'Alyra	APP',
	projectId: '65af7ffc03881e7982d909862c11aa59',
	chains: [skaleCalypsoTestnet],
	ssr: true,
})

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {},
	},
})

const CustomRainbowKitProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<BlockchainProvider>{children}</BlockchainProvider>
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	)
}
export default CustomRainbowKitProvider
