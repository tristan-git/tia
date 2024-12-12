'use client'

import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { Vote, voteSchema } from './schema'
import { RowActionsCell } from './cell/actions'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PersonIcon, ExclamationTriangleIcon, CubeIcon } from '@radix-ui/react-icons'

export const columns: ColumnDef<Vote>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Id' />,
		cell: ({ row }) => {
			return (
				<div className=' text-xs'>
					<Link href={`/dashboard/interventions/${row.getValue('id')}`} className='hover:underline underline-offset-4 '>
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
					<Link href={`/dashboard/interventions/${row.getValue('id')}`} className='hover:underline underline-offset-4 '>
						<Image src={row.getValue('img')} width={80} height={80} className='object-none h-12 w-12 rounded-sm' />
					</Link>
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
			return (
				<div className='flex flex-col text-xs'>
					<div className='font-bold uppercase text-[12px]'>{row?.original?.town}</div>
					<div>{row.getValue('address')}</div>
				</div>
			)
		},
	},

	{
		accessorKey: 'modules',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Module' />,
		cell: ({ row }) => {
			const nbModule = row.getValue('modules')

			return nbModule?.length ? (
				<Badge variant='outline' className='flex space-x-1'>
					<CubeIcon className='h-4 w-3 ' />
					<div>Intervention</div>
				</Badge>
			) : (
				<Badge variant='red'>Aucun module assigné</Badge>
			)
		},
	},

	{
		accessorKey: 'interventions',
		header: ({ column }) => <DataTableColumnHeader column={column} title='nb interventions' />,
		cell: ({ row }) => {
			const interventions = row.getValue('interventions')

			return interventions?.length ? (
				<div className='flex items-center text-xs'>
					<div>{`${interventions?.length}`}</div>
				</div>
			) : (
				<div className='flex items-center text-xs opacity-40'>
					<div>0</div>
				</div>
			)
		},
	},

	{
		accessorKey: 'userModuleAccess',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Permission intervention' />,
		cell: ({ row }) => {
			const userModuleAccess = row.getValue('userModuleAccess')

			return userModuleAccess?.length ? (
				<div className='flex items-center text-xs'>
					<Badge variant='outline' className='flex items-center space-x-1 w-fit'>
						<PersonIcon className='h-4 w-3 ' />
						<div>{`${userModuleAccess?.length} utilisateurs`}</div>
					</Badge>
				</div>
			) : (
				<Badge variant='red' className='flex items-center space-x-1 w-fit'>
					<ExclamationTriangleIcon className='h-4 w-3' />
					<div>Aucune permissions</div>
				</Badge>
			)
		},
	},

	{
		accessorKey: 'mintedByDetail',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Manager' />,
		cell: ({ row }) => {
			const { firstName, lastName } = row.getValue('mintedByDetail') || {}
			return (
				<div className='flex flex-col text-xs'>
					<div>{`${firstName} ${lastName}`}</div>
				</div>
			)
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
