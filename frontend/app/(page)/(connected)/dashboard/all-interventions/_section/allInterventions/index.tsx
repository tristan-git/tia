import React from 'react'
import { useAccount } from 'wagmi'
import { DataTableToolbar } from './tableConf/toolBar'
import { DataTable } from '@/components/shared/dataTable/data-table'
import { columns } from './tableConf/columns'
import { useGetAllEstate } from '@/hooks/queries/all-estates/useGetAllEstate'
import { useGetAllInterventions } from '@/hooks/queries/all-interventions/useGetAllInterventions'

const config = {
	DataTableToolbar: DataTableToolbar,
	useReactTable: { enableRowSelection: false },
}

type AllInterventionsProps = {}

const AllInterventions = ({}: AllInterventionsProps) => {
	const { address: currentAccount } = useAccount()
	const { data } = useGetAllInterventions(currentAccount)

	console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')
	console.log(data)

	return (
		<div className='relative w-full overflow-x-auto'>
			<DataTable data={data || []} columns={columns} config={config} />
		</div>
	)
}

export default AllInterventions
