'use client'

import { ColumnDef } from '@tanstack/react-table'
import { AdminUsers } from './schema'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'


export const columns: ColumnDef<AdminUsers>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => <DataTableColumnHeader column={column} title='id' />,
		cell: ({ row }) => {
			return <div className='max-w-[150px] truncate text-xs'>{row.getValue('id')}</div>
		},
		enableSorting: false,
		enableHiding: false,
	},

	{
		accessorKey: 'firstName',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Prénom' />,
		cell: ({ row }) => {
			// const data = voteSchema?.parse(row.original)
			return <div className=' truncate text-xs'>{row.getValue('firstName')}</div>
		},
	},

	{
		accessorKey: 'lastName',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Nom' />,
		cell: ({ row }) => {
			// const data = voteSchema?.parse(row.original)
			return <div className=' truncate text-xs'>{row.getValue('lastName')}</div>
		},
	},

	{
		accessorKey: 'walletAddress',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Wallet' />,
		cell: ({ row }) => {
			// const data = voteSchema?.parse(row.original)
			return <div className=' truncate text-xs'>{row.getValue('walletAddress')}</div>
		},
	},
]
