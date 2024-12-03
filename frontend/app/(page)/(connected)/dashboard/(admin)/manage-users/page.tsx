'use client'

import { useEffect, useState } from 'react'

import { DataTable } from '@/components/shared/dataTable/data-table'
import { columns } from './_sections/tableConf/columns'
import LastVotes from './_sections/lastVotes'
import { DataTableToolbar } from './_sections/tableConf/toolBar'
import { useReadVotingContracts } from '@/hooks/queries/votes/useAllVotingContracts'
import CreateVote from './_sections/createEstate'
import { getContractVotes } from '@/actions/getContractsVotes'
import { useVotingContracts } from '@/hooks/queries/votes/useVotings'
import { useAccount } from 'wagmi'
import CreateEstate from './_sections/createEstate'
import { useGetAdminUsers } from '@/hooks/queries/admin/useGetUsers'
// import { useVotingContracts } from '@/hooks/queries/votes/useVotings'

const config = {
	DataTableToolbar: DataTableToolbar,
	useReactTable: { enableRowSelection: false },
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VotesPage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function ManageUsers() {
	// const { address: currentAccount, status, isConnecting, isDisconnected, isReconnecting } = useAccount()
	// const { data: dataVoting, status: statusQuery } = useVotingContracts(currentAccount)
	const { data } = useGetAdminUsers()

	return (
		<>
			<div className='container max-w-screen-xl overflow-hidden p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='space-y-1'>
						<h2 className='text-2xl font-semibold tracking-tight'>Les derniers utilisateur enregister</h2>
						<p className='text-sm text-muted-foreground'>Donner acces au role utilisateur</p>
					</div>
					{/* <CreateEstate /> */}
				</div>
				<DataTable data={data || []} columns={columns} config={config} />
			</div>
		</>
	)
}
