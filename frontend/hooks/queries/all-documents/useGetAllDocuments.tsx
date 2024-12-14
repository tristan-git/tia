import { useQuery } from '@tanstack/react-query'

export const useGetAllDocuments = (currentAccount: any) => {
	return useQuery({
		queryKey: [`useGetAllDocuments-${currentAccount}`],
		enabled: !!currentAccount,
		queryFn: async () => {
			const response = await fetch('/api/get-all-documents', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ currentAccount }),
			})

			return response.json()
		},
	})
}
