'use client'

import Link from 'next/link'
import { RowActionsCell } from './cell/actions'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'

export const columns = [
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
		accessorKey: 'documents',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Nb documents' />,
		cell: ({ row }) => {
			const documents = row.getValue('documents')
			return <div className='flex text-xs'>{documents?.length}</div>
		},
	},

	{
		id: 'actions',
		cell: ({ row }) => <RowActionsCell row={row} />,
	},
]
