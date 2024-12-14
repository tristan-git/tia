'use client'

import Link from 'next/link'
import CustomBadge from '@/components/shared/_ui/badge'
import { RowActionsCell } from './cell/actions'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'

export const columns: any = [
	{
		accessorKey: 'id',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Id' />,
		cell: ({ row }) => {
			return (
				<div className=' text-xs'>
					<Link href={`/dashboard/network-estate/${row.getValue('id')}`} className='hover:underline underline-offset-4 '>
						{row.getValue('id')}
					</Link>
				</div>
			)
		},
		enableSorting: false,
		enableHiding: false,
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
			const date = new Date(row.getValue('createdAtTimestamp'))
			return <div className='flex text-xs'>{date.toLocaleString()}</div>
		},
	},

	{
		accessorKey: 'modules',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Modules' />,
		cell: ({ row }) => {
			const modules = row.original?.modules
			return <div className='flex  items-center'>{modules?.moduleName && <CustomBadge text={modules?.moduleName} />}</div>
		},
		filterFn: (row, id, value): any => {
			return value.includes(row.getValue(id))
		},
	},

	{
		id: 'actions',
		cell: ({ row }: any ) => <RowActionsCell row={row} />,
	},
]
