import React from 'react'
import { useAccount } from 'wagmi'
import { useGetInterventionsByNft } from '@/hooks/queries/interventions/useGetInterventionsByNft'
import { DataTableToolbar } from '../tableConf/toolBar'
import { DataTable } from '@/components/shared/dataTable/data-table'
import { columns } from '../tableConf/columns'

const config = {
	DataTableToolbar: DataTableToolbar,
	useReactTable: { enableRowSelection: false },
}

type InterventionsByNftProps = {
	idEstate: any
	tokenId: any
}

const InterventionsByNft = ({ idEstate, tokenId }: InterventionsByNftProps) => {
	const { address: currentAccount } = useAccount()
	const { data } = useGetInterventionsByNft(currentAccount, idEstate, tokenId)

	return <DataTable data={data?.data || []} columns={columns} config={config} />
}

export default InterventionsByNft
