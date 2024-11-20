'use client'

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles, CircleUser } from 'lucide-react'

import { Avatar } from '@/components/ui/avatar'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useAccount, useDisconnect } from 'wagmi'
import ButtonWalletConnect from './ButtonWalletConnect'
import { useAccountModal, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'

export default function WalletConnect() {
	const { address, isConnected } = useAccount()
	const { openAccountModal } = useAccountModal()
	const { openChainModal } = useChainModal()
	const { disconnect } = useDisconnect()

	return (
		<div>
			{!isConnected ? (
				<ButtonWalletConnect />
			) : (
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size='lg'
									className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
								>
									<Avatar className='h-8 w-8 rounded-lg'>
										<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
											<CircleUser className='h-6 w-6 rounded-lg' />
										</div>
									</Avatar>

									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-semibold'>{'tristan'}</span>
										<span className='truncate text-xs'>{address}</span>
									</div>
									<ChevronsUpDown className='ml-auto size-4' />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
								side='bottom'
								align='end'
								sideOffset={4}
							>
								<DropdownMenuLabel className='p-0 font-normal'>
									<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
										<Avatar className='h-8 w-8 rounded-lg'>
											<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
												<CircleUser className='h-6 w-6 rounded-lg' />
											</div>
										</Avatar>

										<div className='grid flex-1 text-left text-sm leading-tight'>
											<span className='truncate font-semibold'>{'tristan'}</span>
											<span className='truncate text-xs'>{address}</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<DropdownMenuGroup>
									<DropdownMenuItem
										onClick={(e) => {
											openAccountModal && openAccountModal()
										}}
									>
										<BadgeCheck />
										Account
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={(e) => {
											openChainModal && openChainModal()
										}}
									>
										<Bell />
										Open Chain Modal
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => disconnect()}>
									<LogOut />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			)}
		</div>
	)
}
