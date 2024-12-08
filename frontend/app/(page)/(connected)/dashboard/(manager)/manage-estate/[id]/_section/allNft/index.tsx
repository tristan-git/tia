import { useGetManagerEstateNft } from '@/hooks/queries/manager/useGetManagerEstateNft'
import React, { useCallback, useMemo, useEffect } from 'react'
import { useAccount } from 'wagmi'

type AllNftProps = {idEstate}

const AllNft = ({idEstate }: AllNftProps) => {
    const { address: currentAccount } = useAccount()
	const { data } = useGetManagerEstateNft(currentAccount,idEstate)
	console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')
	console.log('data')
	console.log(data)

	return <div className=''></div>
}

export default AllNft
