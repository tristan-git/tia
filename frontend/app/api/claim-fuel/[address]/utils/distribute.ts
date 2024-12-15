import { JsonRpcProvider, Wallet } from 'ethers'
import { DISTRIBUTION_VALUE, PRIVATE_KEY, RPC_URL } from './config'

if (!PRIVATE_KEY) throw new Error('Missing Private Key')
if (!RPC_URL) throw new Error('Missing RPC URL')

const provider = new JsonRpcProvider(RPC_URL)
const wallet = new Wallet(PRIVATE_KEY, provider)

interface DistributeParams {
	address: string
}

async function Distribute({ address }: DistributeParams) {
	return await wallet.sendTransaction({
		to: address,
		value: DISTRIBUTION_VALUE,
	})
}

export default Distribute
