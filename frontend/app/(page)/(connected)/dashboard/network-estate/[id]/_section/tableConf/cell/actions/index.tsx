'use client'

import { useState } from 'react'
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
import PermissionIntervention from './assignPermission'
import { useIsManager } from '@/hooks/role/useIsManager'
import { useAccount } from 'wagmi'
import { useHaveAccessModule } from '@/hooks/role/usehaveAccessModule'

interface DataTableRowActionsProps<TData> {
	row: Row<TData>
}

export function RowActionsCell<TData>({ row }: DataTableRowActionsProps<TData>) {
	const { address } = useAccount()
	const [open, setOpen] = useState(false)
	const isManager = useIsManager(address, row?.original?.estateManagerId) as boolean
	const haveAccessModule = useHaveAccessModule({
		contractAddress: row?.original?.estateManagerId,
		tokenId: row?.original?.tokenId,
		userAddress: address as `0x${string}`,
	})

	const handleOpenDialog = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setOpen(true)
	}

	console.log('address=======', address)
	console.log(isManager)
	console.log(haveAccessModule)

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild onClick={handleOpenDialog}>
				<Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
					<DotsHorizontalIcon className='h-4 w-4' />
					<span className='sr-only'>Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[200px]'>
				<DropdownMenuSeparator />

				<PermissionIntervention dataNft={row.original} disabled={!isManager} />
				{/* <PermissionIntervention dataNft={row.original} disabled={!isManager || !haveAccessModule} /> */}

				<DropdownMenuSeparator />

				<DropdownMenuItem>Close</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
