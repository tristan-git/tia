import React from 'react'

import { CircleUser } from 'lucide-react'
import { useAccount } from 'wagmi'
import { checksumAddress } from 'viem'
import CustomBadge from '@/components/shared/_ui/badge'

type NbVotersCellProps = { voters: string }

const NbVotersCell = ({ voters }: NbVotersCellProps) => {
	const { address } = useAccount()
	// const isVoter = voters?.some(({ userId }) => checksumAddress(userId) === checksumAddress(address))

	return (
		<div className='flex space-x-1 items-center text-xs'>
			{/* {isVoter && (
				<div className='flex aspect-square size-5 items-center justify-center rounded-lg bg-lime-200 text-gray-950'>
					<CircleUser className='h-3 w-3 rounded-lg' />
				</div>
			)} */}

			{/* {voters.length ? <CustomBadge text={voters?.length} variant='outline' /> : '-'} */}

			{voters?.length ? voters.length : '-'}
		</div>
	)
}

export default NbVotersCell
