'use client'

import { useEffect, useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { checksumAddress } from 'viem'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { voteSchema } from '@/app/(page)/(connected)/dashboard/votes/_sections/tableConf/schema'
import { useAccount } from 'wagmi'
import AddDocument from './addDocument'
import ValidIntervention from './validIntervention'

interface DataTableRowActionsProps<TData> {
	row: Row<TData>
}

export function RowActionsCell<TData>({ row }: DataTableRowActionsProps<TData>) {
	const { address } = useAccount()

	const [open, setOpen] = useState(false)

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
			<DropdownMenuContent align='end' className='w-[160px]'>
				<AddDocument dataIntervention={row.original} />
				<DropdownMenuSeparator />
				<ValidIntervention dataIntervention={row.original} />
				<DropdownMenuSeparator />
				<DropdownMenuItem>Close</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
