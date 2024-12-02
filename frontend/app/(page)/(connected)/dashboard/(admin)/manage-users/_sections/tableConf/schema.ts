import { WorkflowStatus } from '@/lib/enum'
import { z } from 'zod'

export const userVoterSchema = z.object({
	id: z.string(),
	userId: z.string(),
	votingId: z.string(),
})

export const proposalsSchema = z.object({
	creatorId: z.string(),
	id: z.string(),
	voteCount: z.number(),
	votingId: z.string(),
})

export const votesSchema = z.object({
	id: z.string(),
	proposalId: z.string(),
	voterId: z.string(),
})

export const adminUsersSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	walletAddress: z.string(),
	// title: z.string(),
	// owner: z.string(),
	// workflowStatus: z.nativeEnum(WorkflowStatus),
	// winningProposalID: z.string().nullable(),
	// createdAtBlock: z.string(),
	// createdAtTransactionHash: z.string(),
	// createdAtTimestamp: z.string(),
	// userVoters: z.array(userVoterSchema),
	// proposals: z.array(proposalsSchema),
	// votes: z.array(votesSchema),
})

export type AdminUsers = z.infer<typeof adminUsersSchema>
