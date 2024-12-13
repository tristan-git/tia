import React from 'react'
import ViewDocumentDialog from './viewDocumentDialog'
import { usePermissionDocument } from '@/hooks/queries/role/usePermissionDocument'
import { useAccount } from 'wagmi'
import { CircleBackslashIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

type ViewDocumentProps = {
	data: any
}

const ViewDocument = ({ data }: ViewDocumentProps) => {
	const { address: currentAccount } = useAccount()
	const haveAccess = usePermissionDocument(data?.moduleId, data?.tokenId, currentAccount, parseInt(data?.indexIntervention))

	return haveAccess ? (
		<ViewDocumentDialog dataInter={data} disabled={false} />
	) : (
		<div className='text-xs'>
			<Button variant='outline' size='xs' disabled>
				<CircleBackslashIcon className='w-2 h-2' />
				Permission
			</Button>
		</div>
	)
}

export default ViewDocument
