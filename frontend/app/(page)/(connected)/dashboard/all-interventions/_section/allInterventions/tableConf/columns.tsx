'use client'

import Link from 'next/link'
import { RowActionsCell } from './cell/actions'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import ViewDocument from './cell/actions/viewDocument'

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
		accessorKey: 'title',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Type intervention' />,
		cell: ({ row }) => {
			return <div className='font-bold uppercase text-[11px]'>{row.getValue('title')}</div>
		},
	},

	{
		accessorKey: 'estateManager',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Réseaux' />,
		cell: ({ row }) => {
			return (
				<div className='flex flex-col text-xs'>
					<Link href={`/dashboard/manage-estate/${row?.original?.estateManagerId}`} className='hover:underline underline-offset-4 '>
						<div className='truncate max-w-[100px] uppercase text-[12px]'>{row?.original?.rnbCode}</div>
					</Link>
				</div>
			)
		},
	},

	{
		accessorKey: 'address',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Address' />,
		cell: ({ row }) => {
			return (
				<div className='flex flex-col text-xs'>
					<div className='font-bold uppercase text-[10px]'>{row?.original?.town}</div>
					<div>{row.getValue('address')}</div>
				</div>
			)
		},
	},

	{
		accessorKey: 'isValidated',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Validation' />,
		cell: ({ row }) => {
			return (
				<div className=' text-xs'>
					{row.getValue('isValidated') ? (
						<Badge variant='green' className='flex items-center space-x-1 w-fit'>
							<div>OUI</div>
						</Badge>
					) : (
						<Badge variant='red' className='flex items-center space-x-1 w-fit'>
							<div>NON</div>
						</Badge>
					)}
				</div>
			)
		},
	},

	{
		accessorKey: 'documents',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Documents' />,
		cell: ({ row }) => {
			return <ViewDocument data={row?.original} />
		},
	},

	{
		accessorKey: 'managerDetail',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Gestionnaire' />,
		cell: ({ row }) => {
			const managerDetail = row.getValue('managerDetail')
			return <div className='flex text-xs'>{`${managerDetail?.firstName} ${managerDetail?.lastName}`}</div>
		},
	},

	{
		accessorKey: 'createdByUser',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Intervenant' />,
		cell: ({ row }) => {
			const createdByUser = row.getValue('createdByUser')
			return <div className='flex text-xs'>{`${createdByUser?.firstName} ${createdByUser?.lastName}`}</div>
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
