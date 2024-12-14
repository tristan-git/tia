import React from 'react'

import { useAccount } from 'wagmi'
import { DataTableToolbar } from './tableConf/toolBar'
import { DataTable } from '@/components/shared/dataTable/data-table'
import { columns } from './tableConf/columns'
import { useGetAllDocuments } from '@/hooks/queries/all-documents/useGetAllDocuments'

const config = {
	DataTableToolbar: DataTableToolbar,
	useReactTable: { enableRowSelection: false },
}

type AllDocumentsProps = {}

const AllDocuments = ({}: AllDocumentsProps) => {
	const { address: currentAccount } = useAccount()
	const { data } = useGetAllDocuments(currentAccount)

	return (
		<div className='relative w-full overflow-x-auto'>
			<DataTable data={data || []} columns={columns} config={config} />
		</div>
	)
}

export default AllDocuments
