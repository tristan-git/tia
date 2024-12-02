import { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/provider/theme-provider'
import CustomRainbowKitProvider from '@/components/provider/customRainbowKitProvider'
import './globals.css'

export const metadata: Metadata = {
	title: 'Tia',
	description: 'Tia',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head />
			<body>
				<CustomRainbowKitProvider>
					<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
						{children}
						<Toaster />
					</ThemeProvider>
				</CustomRainbowKitProvider>
			</body>
		</html>
	)
}
