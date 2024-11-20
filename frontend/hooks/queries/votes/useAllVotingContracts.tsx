import { useReadContracts } from 'wagmi'
import { Contracts } from '@/components/provider/blockchainProvider/utils/EContractName'
import { useMemo } from 'react'
import { artifactVotes } from '@/constants/artifacts/votes'


type Scope = { fn: string }

/////////////////////////////////////////////////////////
// format Queries
/////////////////////////////////////////////////////////

const formatQueries = (addressContracts: string[], scopes: Scope[]) => {
	if (!addressContracts.length || !scopes.length) {
		return []
	}

	return addressContracts.flatMap((address) =>
		scopes.map((scope) => ({
			contractName: Contracts.Voting,
			address,
			abi: artifactVotes.abi,
			functionName: scope.fn,
		}))
	)
}

/////////////////////////////////////////////////////////
// format result
/////////////////////////////////////////////////////////

const formatDataTable = (data: any[], contractsAddress: string[], scopes: Scope[]) => {
	if (!data?.length) return []

	return contractsAddress.map((address, index) => {
		const rowData: Record<string, any> = { contractName: Contracts.Voting, address }
		scopes.forEach(({ fn }, scopeIndex) => {
			const dataIndex = index * scopes.length + scopeIndex
			rowData[fn] = data[dataIndex]?.result ?? null
		})

		return {
			...rowData,
			status: 'in progress',
			label: 'documentation',
			priority: 'medium',
		}
	})
}

/////////////////////////////////////////////////////////
// HOOK
/////////////////////////////////////////////////////////

export function useReadVotingContracts({
	contractsAddress,
	scopes,
	scopeKey,
}: {
	contractsAddress: string[]
	scopes: Scope[]
	scopeKey: string
}) {
	const formattedQueries = useMemo(() => formatQueries(contractsAddress, scopes), [contractsAddress, scopes])

	const { data, ...rest } = useReadContracts({
		contracts: formattedQueries,
		scopeKey,
		query: {
			enabled: contractsAddress?.length > 0 && scopes?.length > 0,
		},
	})

	const formattedData = useMemo(() => formatDataTable(data, contractsAddress, scopes), [data, contractsAddress, scopes])

	return { ...rest, data: formattedData }
}

/////////////////////////////////////////////////////////
// ...rest
/////////////////////////////////////////////////////////

// const {
// 	data: dataQuery,
// 	dataUpdatedAt,
// 	error,
// 	errorUpdatedAt,
// 	failureCount,
// 	failureReason,
// 	fetchStatus,
// 	isError,
// 	isFetched,
// 	isFetchedAfterMount,
// 	isFetching,
// 	isLoading,
// 	isLoadingError,
// 	isPaused,
// 	isPending,
// 	isPlaceholderData,
// 	isRefetchError,
// 	isRefetching,
// 	isStale,
// 	isSuccess,
// 	promise,
// 	refetch,
// 	status,
// }
