'use client'

import { useAccount } from 'wagmi'
import { DataTableToolbar } from './_sections/tableConf/toolBar'
import { DataTable } from '@/components/shared/dataTable/data-table'
import { columns } from './_sections/tableConf/columns'
import { useGetAllEstateNetwork } from '@/hooks/queries/all-estate-network/useGetManagerEstate'

const config = {
	DataTableToolbar: DataTableToolbar,
	useReactTable: { enableRowSelection: false },
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VotesPage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function ManageEstate() {
	const { address: currentAccount } = useAccount()
	const { data } = useGetAllEstateNetwork(currentAccount)

	console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')
	console.log(data)

	return (
		<>
			<div className='container max-w-screen-xl overflow-hidden p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='space-y-1'>
						<h2 className='text-2xl font-semibold tracking-tight'>Autorisations module</h2>
						<p className='text-sm text-muted-foreground'>Assigner un module à un Réseaux immobilier</p>
					</div>
				</div>
				<DataTable data={data || []} columns={columns} config={config} />
			</div>
		</>
	)
}
