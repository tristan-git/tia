import React from 'react'

import { CircleUser } from 'lucide-react'
import { useAccount } from 'wagmi'
import { checksumAddress } from 'viem'

type OwnerCellProps = { addressOwner: string }

const OwnerCell = ({ addressOwner }: OwnerCellProps) => {
	const { address } = useAccount()

	return (
		<div className='flex space-x-1 items-center'>
			{checksumAddress(addressOwner) == checksumAddress(address) && (
				<div className='flex aspect-square size-5 items-center justify-center rounded-lg bg-lime-200 text-gray-950'>
					<CircleUser className='h-3 w-3 rounded-lg' />
				</div>
			)}
			<p className='text-xs truncate max-w-32'>{checksumAddress(addressOwner)}</p>
		</div>
	)
}

export default OwnerCell
