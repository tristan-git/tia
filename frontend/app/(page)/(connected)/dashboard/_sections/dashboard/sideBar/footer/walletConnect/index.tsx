'use client'

import { useContext } from 'react'

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from 'lucide-react'
import { useAccount, useDisconnect } from 'wagmi'
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
import { useAccountModal, useChainModal } from '@rainbow-me/rainbowkit'

import ButtonWalletConnect from './ButtonWalletConnect'
import { BlockchainContext } from '@/components/provider/blockchainProvider'

export default function WalletConnect() {
	const { userAccount }: any = useContext(BlockchainContext)
	const { isConnected } = useAccount()
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
											<img className='aspect-square h-full w-full' alt='Avatar' src='https://ui.shadcn.com/avatars/02.png'></img>
										</div>
									</Avatar>

									<div className='grid flex-1 text-left text-sm leading-tight'>
										<span className='truncate font-semibold max-w-30'>{`${userAccount?.firstName} ${userAccount?.lastName}`}</span>
										<span className='truncate text-xs'>{userAccount?.roleName}</span>
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
												<img className='aspect-square h-full w-full' alt='Avatar' src='https://ui.shadcn.com/avatars/02.png'></img>
											</div>
										</Avatar>

										<div className='grid flex-1 text-left text-sm leading-tight'>
											<span className='truncate font-semibold max-w-30'>{`${userAccount?.firstName} ${userAccount?.lastName}`}</span>
											<span className='truncate text-xs'>{userAccount?.roleName}</span>
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
