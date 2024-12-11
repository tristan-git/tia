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

	console.log(data)

//     "id": 1,
//     "tokenId": "2",
//     "metadataURI": "https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/0xa849a38b0bd90ff986473a7a785d1fad5e2b05b5/2/metadata.json",
//     "createdAtTimestamp": "2024-12-10T16:25:21.519Z",
//     "addressInterventionManager": "0xa849a38b0bd90ff986473a7a785d1fad5e2b05b5",
//     "address": "13 rue de la catinierre",
//     "town": "Blois",
//     "img": "https://97tjwcygbwqvo2fa.public.blob.vercel-storage.com/0xa849a38b0bd90ff986473a7a785d1fad5e2b05b5/2/9e164fed97dc7295d004eb93eee909c399e2326f87a73100d3d062dbc994fdf6.jpeg",
//     "ownerDetails": {
//         "id": 2,
//         "walletAddress": "0x0BeC14837e54F84C4815574967F802a8c3a64d7b",
//         "firstName": "Bob",
//         "lastName": "Manager"
//     },
//     "mintedByDetail": {
//         "id": 2,
//         "walletAddress": "0x0BeC14837e54F84C4815574967F802a8c3a64d7b",
//         "firstName": "Bob",
//         "lastName": "Manager"
//     },
//     "modules": [
//         {
//             "id": "0x5bf29f3c940a5edde71ce3d6420e2c192bd314e6",
//             "moduleName": "InterventionManager",
//             "estateManagerId": "0xa849a38b0bd90ff986473a7a785d1fad5e2b05b5"
//         }
//     ],
//     "userModuleAccess": [
//         {
//             "id": 1,
//             "moduleName": "InterventionManager",
//             "authorizedAddress": 3,
//             "revokedAtTimestamp": null,
//             "assignedAtTimestamp": "2024-12-10T16:25:41.661"
//         }
//     ]
// }

	return (
		<div className='relative w-full overflow-x-auto'>
			<DataTable data={data || []} columns={columns} config={config} />
		</div>
	)
}

export default AllNft
