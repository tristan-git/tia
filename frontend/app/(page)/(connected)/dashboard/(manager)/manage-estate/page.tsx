'use client'

import { DataTableToolbar } from './_sections/tableConf/toolBar'
import CreateEstate from './_sections/createEstate'
import { useGetManagerEstate } from '@/hooks/queries/manager/useGetManagerEstate'
import { DataTable } from '@/components/shared/dataTable/data-table'
import { columns } from './_sections/tableConf/columns'

const config = {
	DataTableToolbar: DataTableToolbar,
	useReactTable: { enableRowSelection: false },
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VotesPage
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function ManageEstate() {
	const { data } = useGetManagerEstate()

	return (
		<>
			<div className='container max-w-screen-xl overflow-hidden p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='space-y-1'>
						<h2 className='text-2xl font-semibold tracking-tight'>Réseaux immobilier</h2>
						<p className='text-sm text-muted-foreground'>Tous vos groupement immobilier ici</p>
					</div>
					<CreateEstate />
				</div>
				<DataTable data={data || []} columns={columns} config={config} />
			</div>
		</>
	)
}
