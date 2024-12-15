import React from 'react'
import { useAccount } from 'wagmi'
import { DataTableToolbar } from './tableConf/toolBar'
import { DataTable } from '@/components/shared/dataTable/data-table'
import { columns } from './tableConf/columns'
import { useGetAllEstate } from '@/hooks/queries/all-estates/useGetAllEstate'

const config = {
	DataTableToolbar: DataTableToolbar,
	useReactTable: { enableRowSelection: false },
}

type AllEstateNftProps = {}

const AllEstateNft = ({}: AllEstateNft) => {
	const { address: currentAccount } = useAccount()
	const { data } = useGetAllEstate(currentAccount)

	return (
		<div className='relative w-full overflow-x-auto'>
			<DataTable data={data || []} columns={columns} config={config} />
		</div>
	)
}

export default AllEstateNft
