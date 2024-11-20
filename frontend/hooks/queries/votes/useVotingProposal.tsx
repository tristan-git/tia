import { readContract } from '@wagmi/core'
import { artifactVotes } from '@/constants/artifacts/votes'
import { config } from '@/components/provider/customRainbowKitProvider'

/////////////////////////////////////////////////////////
// HOOK
/////////////////////////////////////////////////////////

export async function useVotingProposal({
	address,
	proposalIds,
	currentAccount,
}: {
	address: `0x${string}`
	proposalIds: number[]
	currentAccount: `0x${string}`
}) {
	const result = []

	async function fetchContracts() {
		for (let index = 0; index < proposalIds.length; index++) {
			const res = await readContract(config, {
				abi: artifactVotes.abi,
				address: address,
				args: [index + 1],
				functionName: 'getOneProposal',
				account: currentAccount,
			})
			result.push(res)
		}
	}

	await fetchContracts()

	return { result }
}
