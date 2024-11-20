import { WorkflowStatus } from '@/lib/enum'

/////////////////////////////////////////////////////////
// status Votes
/////////////////////////////////////////////////////////

export const statusVotes = {
	[WorkflowStatus.RegisteringVoters]: { text: 'Registering voters', variant: 'blue' },
	[WorkflowStatus.ProposalsRegistrationStarted]: { text: 'Proposals registration started', variant: 'green' },
	[WorkflowStatus.ProposalsRegistrationEnded]: { text: 'Proposals registration ended', variant: 'yellow' },
	[WorkflowStatus.VotingSessionStarted]: { text: 'Voting session started', variant: 'purple' },
	[WorkflowStatus.VotingSessionEnded]: { text: 'Voting session ended', variant: 'red' },
	[WorkflowStatus.VotesTallied]: { text: 'Votes tallied', variant: 'gray' },
}

export const statusVoteOptions = [
	{
		value: WorkflowStatus.RegisteringVoters,
		label: 'Registering voters',
		variant: 'blue',
	},
	{
		value: WorkflowStatus.ProposalsRegistrationStarted,
		label: 'Proposals registration started',
		variant: 'green',
	},
	{
		value: WorkflowStatus.ProposalsRegistrationEnded,
		label: 'Proposals registration ended',
		variant: 'yellow',
	},
	{
		value: WorkflowStatus.VotingSessionStarted,
		label: 'Voting session started',
		variant: 'purple',
	},
	{
		value: WorkflowStatus.VotingSessionEnded,
		label: 'Voting session ended',
		variant: 'red',
	},
	{
		value: WorkflowStatus.VotesTallied,
		label: 'Votes tallied',
		variant: 'gray',
	},
]
