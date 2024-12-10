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
	setSelectedNft: any
	selectedNft: any
}

const AllNft = ({ idEstate, setSelectedNft, selectedNft }: AllNftProps) => {
	const { address: currentAccount } = useAccount()
	const { data } = useGetManagerEstateNft(currentAccount, idEstate)

	// {
	//     "id": 50,
	//     "tokenId": "25",
	//     "estateManagerId": "0x155dfdcbb037b853580c1c8671d0c52b767c58bd",
	//     "ownerAddress": 6,
	//     "metadataURI": "https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/0x155dfdcbb037b853580c1c8671d0c52b767c58bd/24/metadata.json",
	//     "createdAtTimestamp": "2024-12-08T10:59:23.856Z",
	//     "mintedBy": 6,
	//     "transactionHash": "0x093db860d0ce8193966ebd1ce7801b8ee7b9b7afe5bcfc761e6125390c6e00fd",
	//     "address": "dsdsf",
	//     "town": "sdf",
	//     "img": "https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/0x155dfdcbb037b853580c1c8671d0c52b767c58bd/24/57f048b911192f6cea1b7aa9cdca8e4b26424fc06168236c1918dd6d1a5b82c6.png"
	// }

	return (
		<div className='relative w-full overflow-x-auto'>
			<DataTable data={data || []} columns={columns} config={config} />
		</div>
	)
}

export default AllNft
