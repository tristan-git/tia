'use client'

import { useEffect, useState } from 'react'

import { DataTable } from '@/components/shared/dataTable/data-table'
import { columns } from './_sections/tableConf/columns'
import LastVotes from './_sections/lastVotes'
import { DataTableToolbar } from './_sections/tableConf/toolBar'
import { useReadVotingContracts } from '@/hooks/queries/votes/useAllVotingContracts'
import CreateVote from './_sections/createVote'
import { getContractVotes } from '@/actions/getContractsVotes'
import { useVotingContracts } from '@/hooks/queries/votes/useVotings'
import { useAccount } from 'wagmi'
// import { useVotingContracts } from '@/hooks/queries/votes/useVotings'

const config = {
	DataTableToolbar: DataTableToolbar,
	useReactTable: { enableRowSelection: false },
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VotesPage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function VotesPage() {
	const { address: currentAccount, status, isConnecting, isDisconnected, isReconnecting } = useAccount()
	const { data: dataVoting, status: statusQuery } = useVotingContracts(currentAccount)

	return (
		<>
			{/* <LastVotes votes={data} /> */}
			{status == 'connected' ? (
				<div className='container max-w-screen-xl overflow-hidden p-4'>
					<div className='flex items-center justify-between mb-4'>
						<div className='space-y-1'>
							<h2 className='text-2xl font-semibold tracking-tight'>Les derniers votes publiés</h2>
							<p className='text-sm text-muted-foreground'>Participez aux prochaines sessions de vote et faites entendre votre voix !</p>
						</div>
						<CreateVote />
					</div>
					<DataTable data={dataVoting || []} columns={columns} config={config} />
				</div>
			) : (
				<p>need login & https://www.sfuelstation.com/</p>
			)}
		</>
	)
}
