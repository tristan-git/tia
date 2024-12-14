import React from 'react'

import { Button } from '@/components/ui/button'
import { usePermissionDocument } from '@/hooks/role/usePermissionDocument'
import { DownloadIcon } from '@radix-ui/react-icons'
import { useAccount } from 'wagmi'
import { bucketPath } from '@/constants/bucket'

type DownloadDocumentProps = { row: any }

const DownloadDocument = ({ row }: DownloadDocumentProps) => {
	const { address: currentAccount } = useAccount()
	const haveAccess = usePermissionDocument(row?.moduleId, row?.tokenId, currentAccount, parseInt(row?.indexIntervention))

	const openDocument = () => {
		if (haveAccess) {
			const { tokenId, indexIntervention, documentHash, fileExtension, estateManagerId } = row
			const file = `${bucketPath}/${estateManagerId}/${tokenId}/interventions/${indexIntervention}/${documentHash}.${fileExtension}`
			window.open(file, '_blank')
		}
	}

	return (
		<div>
			<Button variant='outline' size='icon' onClick={openDocument} disabled={!haveAccess}>
				<DownloadIcon />
			</Button>
		</div>
	)
}

export default DownloadDocument
