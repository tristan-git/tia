import React, { useEffect, useState } from 'react'
import {
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { statusVotes } from '@/constants/statusVotes'
import { toast } from '@/hooks/use-toast'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { artifactVotes } from '@/constants/artifacts/votes'

const RadioItem = ({ text, status, selectedStatus }) => (
	<DropdownMenuRadioItem
		key={text}
		value={status.toString()}
		onSelect={(event) => event.preventDefault()}
		disabled={parseInt(status) <= selectedStatus || parseInt(status) > selectedStatus + 1}
	>
		{text}
	</DropdownMenuRadioItem>
)

type UpdateStatusProps = {
	selectedStatus: number
	setSelectedStatus: any
	contractAddress: any
	setOpenMenu: any
}

const UpdateStatus = ({ selectedStatus, setSelectedStatus, contractAddress,setOpenMenu }: UpdateStatusProps) => {
	const [open, setOpen] = useState(false)
	const { data: hash, error, isPending, writeContract } = useWriteContract()
	const { isLoading, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({ hash })

	const handleStatusChange = async (newStatus: string) => {
		setSelectedStatus(newStatus)

		switch (newStatus) {
			// WorkflowStatus.RegisteringVoters
			case '0':
				break

			// WorkflowStatus.ProposalsRegistrationStarted
			case '1':
				writeContract({
					address: contractAddress,
					abi: artifactVotes.abi,
					functionName: 'startProposalsRegistering',
					args: [],
				})
				break

			// WorkflowStatus.ProposalsRegistrationEnded
			case '2':
				writeContract({
					address: contractAddress,
					abi: artifactVotes.abi,
					functionName: 'endProposalsRegistering',
					args: [],
				})
				break

			// WorkflowStatus.VotingSessionStarted
			case '3':
				writeContract({
					address: contractAddress,
					abi: artifactVotes.abi,
					functionName: 'startVotingSession',
					args: [],
				})
				break

			// WorkflowStatus.VotingSessionEnded
			case '4':
				writeContract({
					address: contractAddress,
					abi: artifactVotes.abi,
					functionName: 'endVotingSession',
					args: [],
				})
				break

			// WorkflowStatus.VotesTallied
			case '5':
				writeContract({
					address: contractAddress,
					abi: artifactVotes.abi,
					functionName: 'tallyVotes',
					args: [],
				})
				break
			default:
				console.log('Action inconnue.')
		}
	}

	useEffect(() => {
		if (isSuccess) {
			toast({ title: 'Status Successful', description: 'Status succefull change' })
			setOpen(false)
			setOpenMenu(false)
		}
		if (error) {
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: error?.name ?? 'Undefined error',
			})
		}
	}, [isSuccess, error])

	return (
		<DropdownMenuSub open={open} onOpenChange={setOpen}>
			<DropdownMenuSubTrigger>Update status</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<DropdownMenuRadioGroup value={selectedStatus.toString()} onValueChange={(value) => handleStatusChange(value)}>
					{Object.entries(statusVotes).map(([status, details]) => (
						<RadioItem key={status} text={details.text} status={status} selectedStatus={selectedStatus} />
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	)
}

export default UpdateStatus
