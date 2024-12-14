'use client'

import { useContext, useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AssignModuleDialog from './assignModule'
import { BlockchainContext } from '@/components/provider/blockchainProvider'

interface DataTableRowActionsProps<TData> {
	row: Row<TData>
}

export function RowActionsCell<TData>({ row }: DataTableRowActionsProps<TData>) {
	const [open, setOpen] = useState(false)
	const { userAccount } = useContext(BlockchainContext)

	const handleOpenDialog = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setOpen(true)
	}

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild onClick={handleOpenDialog}>
				<Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
					<DotsHorizontalIcon className='h-4 w-4' />
					<span className='sr-only'>Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[200px]'>
				<AssignModuleDialog
					setOpenMenu={setOpen}
					contractAddress={row.original.id as any}
					disabled={userAccount?.roleName !== 'admin'}
					managerAddress={row?.original?.manager?.walletAddress}
				/>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Close</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
