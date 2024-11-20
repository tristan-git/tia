import { useQuery } from '@tanstack/react-query'
import { GraphQLClient, gql } from 'graphql-request'

// const endpoint = 'http://localhost:42069'
const endpoint = 'https://solidity-app-production.up.railway.app/'

const client = new GraphQLClient(endpoint)

export type TVotings = {
	id: string
	title: string
	owner: string
	workflowStatus: number
	winningProposalID?: number
	createdAtBlock: string
	createdAtTransactionHash: string
	createdAtTimestamp: string
}

export const useVotingContracts = (currentAccount) => {
	return useQuery<TVotings[]>({
		queryKey: ['voting_contracts'],
		enabled: true,
		// networkMode: "online",
		// initialData,
		queryFn: async () => {
			const response = (await client.request(gql`
				{
					votingss {
						items {
							id
							title
							userVoters {
								items {
									id
									userId
									votingId
								}
							}
							owner
							createdAtTransactionHash
							createdAtTimestamp
							createdAtBlock
							winningProposalID
							workflowStatus
							proposals {
								items {
									creatorId
									id
									voteCount
									votingId
								}
							}
							votes {
								items {
									id
									proposalId
									voterId
								}
							}
						}
					}
				}
			`)) as {
				votingss: {
					id: string
					title: string
					owner: string
					workflowStatus: number
					winningProposalID?: number
					createdAtBlock: string
					createdAtTransactionHash: string
					createdAtTimestamp: string
				}[]
			}

			return response?.votingss?.items?.map(
				({
					id,
					title,
					owner,
					workflowStatus,
					winningProposalID,
					createdAtBlock,
					createdAtTransactionHash,
					createdAtTimestamp,
					userVoters,
					proposals,
					votes,
				}) => ({
					id,
					title,
					owner,
					workflowStatus,
					winningProposalID,
					createdAtBlock,
					createdAtTransactionHash,
					createdAtTimestamp,
					userVoters: userVoters?.items,
					proposals: proposals?.items,
					votes: votes?.items,
				})
			)
		},
		// staleTime: Number.POSITIVE_INFINITY,
		refetchInterval: 3_000,
	})
}
