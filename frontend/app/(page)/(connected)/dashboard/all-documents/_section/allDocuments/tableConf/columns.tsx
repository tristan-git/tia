'use client'

import Link from 'next/link'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import DownloadDocument from './cell/downloadDoc'

export const columns = [
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
		accessorKey: 'title',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Document' />,
		cell: ({ row }) => {
			return <div className='font-bold uppercase text-[11px]'>{row.getValue('title')}</div>
		},
	},

	{
		accessorKey: 'titleIntervention',
		header: ({ column }) => <DataTableColumnHeader column={column} title='intervention' />,
		cell: ({ row }) => {
			return <div className=' text-[11px]'>{row.getValue('titleIntervention')}</div>
		},
	},

	{
		accessorKey: 'documentHash',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Hash' />,
		cell: ({ row }) => {
			return <div className='truncate max-w-[80px] text-[11px]'>{row.getValue('documentHash')}</div>
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
		accessorKey: 'estateManager',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Réseaux' />,
		cell: ({ row }) => {
			return (
				<div className='flex flex-col text-xs'>
					<Link href={`/dashboard/network-estate/${row?.original?.estateManagerId}`} className='hover:underline underline-offset-4 '>
						<div className='truncate max-w-[100px] uppercase text-[11px]'>{row?.original?.rnbCode}</div>
					</Link>
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
			const datePart = date.toLocaleDateString()
			const timePart = date.toLocaleTimeString()
			return (
				<div className='flex flex-col text-xs'>
					<span className=''>{datePart}</span>
					<span className='opacity-60'>{timePart}</span>
				</div>
			)
		},
	},

	{
		id: 'actions',
		cell: ({ row }) => <DownloadDocument row={row.original} />,
	},
]
