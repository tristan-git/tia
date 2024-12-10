'use client'

import {  useState } from 'react'
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

import { useAccount } from 'wagmi'
import AddDocument from './addDocument'
import ValidIntervention from './validIntervention'
import { useIsManager } from '@/hooks/queries/role/useIsManager'
import { useIsInterventionPrestataire } from '@/hooks/queries/role/useIsInterventionPrestataire'
import PermissionDocument from './permissionDocument'

interface DataTableRowActionsProps<TData> {
	row: Row<TData>
}

export function RowActionsCell<TData>({ row }: DataTableRowActionsProps<TData>) {
	const { address } = useAccount()
	const [open, setOpen] = useState(false)
	const isManager = useIsManager(address, row?.original?.estateManagerId) as boolean
	const isValidatedIntervention = row?.original?.isValidated
	const isPrestataire = useIsInterventionPrestataire({
		contractAddress: row?.original?.estateManagerId,
		tokenId: row?.original?.tokenId,
		userAddress: address as `0x${string}`,
		titleIntervention: row?.original?.title,
		addressInterventionManager: row?.original?.moduleId,
		createdByUserWallet: row?.original?.createdByUser?.walletAddress,
		indexIntervention: row?.original?.indexIntervention,
	})

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
			<DropdownMenuContent align='end' className='w-[180px]'>
				<AddDocument dataIntervention={row.original} disabled={isValidatedIntervention || !isPrestataire} />
				<PermissionDocument dataIntervention={row.original} disabled={!isManager} />
				<ValidIntervention dataIntervention={row.original} disabled={!isManager} />
				<DropdownMenuSeparator />
				<DropdownMenuItem>Close</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
