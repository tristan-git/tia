'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Vote, voteSchema } from './schema'
import OwnerCell from './cell/OwnerCell'
import { statusVotes } from '@/constants/statusVotes'
import CustomBadge from '@/components/shared/_ui/badge'
import { RowActionsCell } from './cell/actions'
import { WorkflowStatus } from '@/lib/enum'
import NbVotersCell from './cell/NbVotersCell'
import WinnerDisplay from './cell/winnerDisplay'
import { checksumAddress } from 'viem'
import { Cross2Icon } from '@radix-ui/react-icons'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'
import Link from 'next/link'

export const columns: ColumnDef<Vote>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Id' />,
		cell: ({ row }) => {
			return (
				<div className=' text-xs'>
					<Link href={`/dashboard/manage-estate/${row.getValue('id')}`} className='hover:underline underline-offset-4 '>
						{row.getValue('id')}
					</Link>
				</div>
			)
		},
		enableSorting: false,
		enableHiding: false,
	},

	{
		accessorKey: 'tokenId',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Nft id' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>{row.getValue('tokenId')}</div>
		},
	},

	{
		accessorKey: 'title',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Type intervention' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>{row.getValue('title')}</div>
		},
	},
	{
		accessorKey: 'isValidated',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Valider' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>{row.getValue('isValidated') ? 'oui' : 'non'}</div>
		},
	},

	{
		accessorKey: 'createdAtTimestamp',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Creer le' />,
		cell: ({ row }) => {
			const date = new Date(row.getValue('createdAtTimestamp'))
			return <div className='flex text-xs'>{date.toLocaleString()}</div>
		},
	},

	{
		id: 'actions',
		cell: ({ row }) => <RowActionsCell row={row} />,
	},
]
