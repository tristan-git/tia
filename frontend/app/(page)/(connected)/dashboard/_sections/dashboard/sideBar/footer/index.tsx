import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar'
import WalletConnect from './walletConnect'
import TestButton from './walletConnect/ButtonWalletConnect'
import { useContext } from 'react'
import { BlockchainContext } from '@/components/provider/blockchainProvider'
import { Button } from 'react-day-picker'
import { Contracts } from '@/components/provider/blockchainProvider/utils/EContractName'

type nameProps = {}

const DashboardSideBarFooter = ({}: nameProps) => {
	return (
		<>
			<SidebarFooter>
				<WalletConnect />
			</SidebarFooter>
			<SidebarRail />
		</>
	)
}

export default DashboardSideBarFooter
