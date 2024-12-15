'use client'

import { Button } from '@/components/ui/button'
import { ConnectButton, useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useDisconnect } from 'wagmi'

type nameProps = {
	text: any
	login: boolean
	noAccount: boolean
}

const ButtonWalletConnect = ({ text, login, noAccount }: nameProps) => {
	const { disconnect, isSuccess } = useDisconnect()
	const [open, setOpen] = useState(false)
	const { openConnectModal } = useConnectModal()

	useEffect(() => {
		if (open && isSuccess) {
			openConnectModal && openConnectModal()
			setOpen(false)
		}
	}, [open, isSuccess])
	return (
		<ConnectButton.Custom>
			{({ account, chain, openChainModal, openConnectModal, authenticationStatus, mounted, openAccountModal }) => {
				const ready = mounted && authenticationStatus !== 'loading'
				const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')
				return (
					<div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
						{(() => {
							if (!connected) {
								return (
									<Button className='w-full' variant='outline' onClick={openConnectModal} type='button'>
										{text}
									</Button>
								)
							}
							if (login) {
								return (
									<Button
										className='w-full'
										variant='outline'
										onClick={() => {
											if (noAccount && connected) {
												disconnect()
												setOpen(true)
											} else {
												openConnectModal()
											}
										}}
										type='button'
									>
										{text}
									</Button>
								)
							}
							if (chain?.unsupported) {
								return (
									<Button variant='destructive' className='w-full' onClick={openChainModal} type='button'>
										Wrong network
									</Button>
								)
							}
							return <div style={{ display: 'flex', gap: 12 }}></div>
						})()}
					</div>
				)
			}}
		</ConnectButton.Custom>
	)
}
export default ButtonWalletConnect
