import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useVotingProposal } from '@/hooks/queries/votes/useVotingProposal'
import { useAccount } from 'wagmi'
import { checksumAddress } from 'viem'
import { Cross2Icon } from '@radix-ui/react-icons'

type WinnerDisplayProps = { winningProposalID: any; address: any; data: any }

const WinnerDisplay = ({ winningProposalID, address, data }: WinnerDisplayProps) => {
	const { address: currentAccount } = useAccount()
	const [proposals, setProposals] = useState([])

	const isVoter = data?.userVoters?.some(
		({ userId }) => checksumAddress(userId as `0x${string}`) === checksumAddress(currentAccount as `0x${string}`)
	)

	useEffect(() => {
		const fetchProposal = async () => {
			const { result } = await useVotingProposal({
				proposalIds: [parseInt(winningProposalID)],
				address: address,
				currentAccount,
			})

			setProposals(result)
		}

		isVoter && fetchProposal()
	}, [currentAccount])

	return isVoter ? (
		<Popover>
			<PopoverTrigger>Open</PopoverTrigger>
			<PopoverContent>
				{proposals?.map(({ title, description }, i) => (
					<>
						<div className='font-bold'> {title}</div>
						<div className='text-xs text-zinc-500'>{description}</div>
					</>
				))}
			</PopoverContent>
		</Popover>
	) : (
		<Cross2Icon />
	)
}

export default WinnerDisplay
