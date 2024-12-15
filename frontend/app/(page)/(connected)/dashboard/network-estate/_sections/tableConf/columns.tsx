'use client'

import Link from 'next/link'
import { CubeIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const columns = [
	{
		accessorKey: 'rnbCode',
		header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
		cell: ({ row }) => {
			return (
				<div className=' text-xs font-bold'>
					{
						<Link href={`/dashboard/network-estate/${row.original.id}`} className='hover:underline underline-offset-4 '>
							{row.getValue('rnbCode')}
						</Link>
					}
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
		accessorKey: 'modules',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Module' />,
		cell: ({ row }) => {
			const modules = row.original?.moduleName

			return modules ? (
				<Badge variant='outline' className='flex space-x-1 w-fit'>
					<CubeIcon className='h-4 w-3 ' />
					<div>Intervention</div>
				</Badge>
			) : (
				<Badge variant='red'>Aucun module assigné</Badge>
			)
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
		id: 'actions',
		cell: ({ row }) => {
			return (
				<Link href={`/dashboard/network-estate/${row.original.id}`} className='hover:underline underline-offset-4 '>
					<Button variant='outline' size='icon'>
						<EyeOpenIcon />
					</Button>
				</Link>
			)
		},
	},
]
