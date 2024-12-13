'use client'

import Image from 'next/image'

import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'
import Link from 'next/link'
import { PersonIcon, ExclamationTriangleIcon, CubeIcon, ClipboardIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

export const columns = [
	{
		accessorKey: 'img',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Image' />,
		cell: ({ row }) => {
			return (
				<div className=' text-xs'>
					<Link href={`/dashboard/interventions/${row?.original?.nftId}`} className='hover:underline underline-offset-4 '>
						<Image src={row.getValue('img')} width={80} height={80} className='object-none h-12 w-12 rounded-sm' />
					</Link>
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
					<Link href={`/dashboard/manage-estate/${row?.original?.estateManager?.id}`} className='hover:underline underline-offset-4 '>
						<div className='font-bold uppercase text-[12px]'>{row?.original?.estateManager?.rnbCode}</div>
					</Link>
					<Link href={`/dashboard/manage-estate/${row?.original?.estateManager?.id}`} className='hover:underline underline-offset-4 '>
						<div>{row?.original?.estateManager?.networkTypes}</div>
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
					<div className='font-bold uppercase text-[12px]'>{row?.original?.town}</div>
					<div>{row.getValue('address')}</div>
				</div>
			)
		},
	},

	{
		accessorKey: 'interventionCount',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Mes interventions' />,
		cell: ({ row }) => {
			const interventions = parseInt(row.getValue('interventionCount'))

			return interventions ? (
				<div className='flex items-center text-xs'>
					<Link href={`/dashboard/interventions/${row?.original?.nftId}`} className='hover:underline underline-offset-4 '>
						<div className='flex space-x-1'>
							<ClipboardIcon />
							{`${interventions} intervention${interventions > 1 ? 's' : ''}`}
						</div>
					</Link>
				</div>
			) : (
				<div className='flex items-center text-xs '>
					<div>-</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'documentCount',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Mes docs accessible' />,
		cell: ({ row }) => {
			const documentCount = parseInt(row.getValue('documentCount'))

			return documentCount ? (
				<div className='flex items-center text-xs'>
					<Link href={`/dashboard/interventions/${row?.original?.nftId}`} className='hover:underline underline-offset-4 '>
						<div className='flex space-x-1'>
							<ClipboardIcon />
							{`${documentCount} document${documentCount > 1 ? 's' : ''}`}
						</div>
					</Link>
				</div>
			) : (
				<div className='flex items-center text-xs'>
					<div>-</div>
				</div>
			)
		},
	},

	{
		accessorKey: 'mintedByDetail',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Gestionnaire' />,
		cell: ({ row }) => {
			const { firstName, lastName } = row.getValue('estateManager')?.managerDetails || {}
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
		cell: ({ row }) => (
			<Link href={`/dashboard/interventions/${row?.original?.nftId}`} className='hover:underline underline-offset-4 '>
				<Button variant='outline' size='icon'>
					<EyeOpenIcon />
				</Button>
			</Link>
		),
	},
]
