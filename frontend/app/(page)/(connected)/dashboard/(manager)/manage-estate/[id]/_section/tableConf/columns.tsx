'use client'

import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Vote, voteSchema } from './schema'
import { statusVotes } from '@/constants/statusVotes'
import CustomBadge from '@/components/shared/_ui/badge'
import { RowActionsCell } from './cell/actions'
import { WorkflowStatus } from '@/lib/enum'
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
		accessorKey: 'img',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Image' />,
		cell: ({ row }) => {
			return (
				<div className=' text-xs'>
					<Image src={row.getValue('img')} width={80} height={80} className='object-cover h-18 w-18' />
				</div>
			)
		},
	},

	{
		accessorKey: 'tokenId',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Token ID' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>#{row.getValue('tokenId')}</div>
		},
	},

	{
		accessorKey: 'address',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
		cell: ({ row }) => {
			return <div className='flex text-xs'>{row.getValue('address')}</div>
		},
	},
	{
		accessorKey: 'town',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Ville' />,
		cell: ({ row }) => {
			return <div className='flex text-xs'>{row.getValue('town')}</div>
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
