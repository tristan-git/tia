'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Vote, voteSchema } from './schema'
import OwnerCell from './cell/OwnerCell'
import { statusVotes } from '@/constants/statusVotes'
import CustomBadge from '@/components/shared/_ui/badge'
import { RowActionsCell } from './cell/actions'
import { WorkflowStatus } from '@/lib/enum'
import NbVotersCell from './cell/NbVotersCell'
import WinnerDisplay from './cell/winnerDisplay'
import { checksumAddress } from 'viem'
import { Cross2Icon } from '@radix-ui/react-icons'
import { DataTableColumnHeader } from '@/components/shared/dataTable/data-table-column-header'

export const columns: ColumnDef<Vote>[] = [
	// {
	// 	id: 'select',
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label='Select all'
	// 			className='translate-y-[2px]'
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label='Select row'
	// 			className='translate-y-[2px]'
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// TEST
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	{
		accessorKey: 'id',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Id' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>{row.getValue('id')}</div>
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
		header: ({ column }) => <DataTableColumnHeader column={column} title='Manager' />,
		cell: ({ row }) => {
			return (
				<div className=' text-xs'>{`${row.getValue('manager').firstName} ${row.getValue('manager').lastName}`}</div>
			)
		},
	},

	{
		accessorKey: 'admin',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Admin' />,
		cell: ({ row }) => {
			return <div className=' text-xs'>{`${row.getValue('admin').firstName} ${row.getValue('admin').lastName}`}</div>
		},
	},

	// {
	// 	accessorKey: 'owner',
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title='owner' />,
	// 	cell: ({ row }) => {
	// 		return (
	// 			<div className='flex space-x-2'>
	// 				<OwnerCell addressOwner={row.getValue('owner')} />
	// 			</div>
	// 		)
	// 	},
	// },

	// {
	// 	accessorKey: 'userVoters',
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title='voters' />,
	// 	cell: ({ row }) => {
	// 		return (
	// 			<div className='flex text-xs'>
	// 				<NbVotersCell voters={row.getValue('userVoters')} />
	// 			</div>
	// 		)
	// 	},
	// },

	// {
	// 	accessorKey: 'proposals',
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title='proposals' />,
	// 	cell: ({ row }) => {
	// 		return (
	// 			<div className='flex text-xs'>
	// 				{row.getValue('proposals')?.length ? row.getValue('proposals')?.length : '-'}
	// 				{/* {row.getValue('proposals')?.length ? <CustomBadge text={row.getValue('proposals')?.length} variant='outline' /> : '-'} */}
	// 			</div>
	// 		)
	// 	},
	// },

	// {
	// 	accessorKey: 'proposals',
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title='votes' />,
	// 	cell: ({ row }) => {
	// 		const proposal = row.getValue('proposals')
	// 		const totalVotes = proposal?.reduce((sum, item) => sum + item.voteCount, 0)

	// 		return (
	// 			<div className='flex text-xs'>
	// 				{
	// 					proposal?.length ? totalVotes : '-'
	// 					// proposal?.length ? <CustomBadge text={totalVotes} variant='outline' /> : '-'
	// 				}
	// 			</div>
	// 		)
	// 	},
	// },
	// {
	// 	accessorKey: 'winningProposalID',
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title='Winner' />,
	// 	cell: ({ row }) => {
	// 		const winningProposalID = row.getValue('winningProposalID')
	// 		const address = row.getValue('id')
	// 		const data = voteSchema.parse(row.original)

	// 		return (
	// 			<div className='flex text-xs'>
	// 				{winningProposalID ? <WinnerDisplay winningProposalID={winningProposalID} address={address} data={data} /> : '-'}
	// 			</div>
	// 		)
	// 	},
	// },

	// {
	// 	accessorKey: 'createdAtTimestamp',
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title='Created at' />,
	// 	cell: ({ row }) => {
	// 		const date = new Date(row.getValue('createdAtTimestamp') * 1000)
	// 		return <div className='flex text-xs'>{date.toLocaleString()}</div>
	// 	},
	// },

	// {
	// 	accessorKey: 'workflowStatus',
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
	// 	cell: ({ row }) => {
	// 		const statusIndex = row.getValue('workflowStatus') as WorkflowStatus
	// 		return (
	// 			<div className='flex  items-center'>
	// 				<CustomBadge text={statusVotes[statusIndex].text} variant={statusVotes[statusIndex].variant} />
	// 			</div>
	// 		)
	// 	},
	// 	filterFn: (row, id, value) => {
	// 		return value.includes(row.getValue(id))
	// 	},
	// },

	// {
	// 	id: 'actions',
	// 	cell: ({ row }) => <RowActionsCell row={row} />,
	// },

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// TEST
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// {
	// 	accessorKey: 'priority',
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' />,
	// 	cell: ({ row }) => {
	// 		const priority = priorities.find((priority) => priority.value === row.getValue('priority'))

	// 		if (!priority) {
	// 			return null
	// 		}

	// 		return (
	// 			<div className='flex items-center'>
	// 				{priority.icon && <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
	// 				<span>{priority.label}</span>
	// 			</div>
	// 		)
	// 	},
	// 	filterFn: (row, id, value) => {
	// 		return value.includes(row.getValue(id))
	// 	},
	// },

	// {
	// 	accessorKey: 'status',
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
	// 	cell: ({ row }) => {
	// 		const status = statuses.find((status) => status.value === row.getValue('status'))

	// 		if (!status) {
	// 			return null
	// 		}

	// 		return (
	// 			<div className='flex w-[100px] items-center'>
	// 				{status.icon && <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
	// 				<span>{status.label}</span>
	// 			</div>
	// 		)
	// 	},
	// 	filterFn: (row, id, value) => {
	// 		return value.includes(row.getValue(id))
	// 	},
	// },
]
