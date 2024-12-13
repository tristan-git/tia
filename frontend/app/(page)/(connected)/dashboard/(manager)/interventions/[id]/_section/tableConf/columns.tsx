'use client'

import Link from 'next/link'
import { RowActionsCell } from './cell/actions'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
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
			return <div className='font-bold uppercase text-[11px]'>{row.getValue('title')}</div>
		},
	},
	{
		accessorKey: 'isValidated',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Valider' />,
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
