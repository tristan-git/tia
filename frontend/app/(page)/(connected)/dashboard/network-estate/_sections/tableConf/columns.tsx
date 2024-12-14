'use client'

import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'
import Link from 'next/link'

export const columns = [
	{
		accessorKey: 'id',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Id' />,
		cell: ({ row }) => {
			return (
				<div className=' text-xs truncate max-w-32'>
					<Link href={`/dashboard/manage-estate/${row.getValue('id')}`} className='hover:underline underline-offset-4 '>
						{row.getValue('id')}
					</Link>
				</div>
			)
		},
	},

	{
		accessorKey: 'networkTypes',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Type de réseaux' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>{row.original.networkTypes}</div>
		},
	},

	{
		accessorKey: 'rnbCode',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Code RNB' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>{row.getValue('rnbCode')}</div>
		},
	},

	{
		accessorKey: 'manager',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Gestionnaire' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>{`${row.getValue('manager').firstName} ${row.getValue('manager').lastName}`}</div>
		},
	},

	{
		accessorKey: 'admin',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Admin' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>{`${row.getValue('admin').firstName} ${row.getValue('admin').lastName}`}</div>
		},
	},

	{
		accessorKey: 'createdAtTimestamp',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Creer le' />,
		cell: ({ row }) => {
			console.log(row.getValue('createdAtTimestamp'))
			const date = new Date(row.getValue('createdAtTimestamp'))
			return <div className='flex text-xs'>{date.toLocaleString()}</div>
		},
	},
]
