import React from 'react'
import { useGetManagerEstateNft } from '@/hooks/queries/manager/useGetManagerEstateNft'
import { useAccount } from 'wagmi'
import { DataTableToolbar } from '../tableConf/toolBar'
import { DataTable } from '@/components/shared/dataTable/data-table'
import { columns } from '../tableConf/columns'

const config = {
	DataTableToolbar: DataTableToolbar,
	useReactTable: { enableRowSelection: false },
}

type AllNftProps = {
	idEstate: any
}

const AllNft = ({ idEstate }: AllNftProps) => {
	const { address: currentAccount } = useAccount()
	const { data } = useGetManagerEstateNft(currentAccount, idEstate)

	return (
		<div className='relative w-full overflow-x-auto'>
			<DataTable data={data || []} columns={columns} config={config} />
		</div>
	)
}

export default AllNft
