import { JsonRpcProvider, Wallet } from 'ethers'
import { PRIVATE_KEY, RPC_URL } from './config'

if (!PRIVATE_KEY) throw new Error('Missing Private Key')
if (!RPC_URL) throw new Error('Missing RPC URL')

const provider = new JsonRpcProvider(RPC_URL)
const wallet = new Wallet(PRIVATE_KEY, provider)

async function Balance(): Promise<string> {
	return await provider.getBalance(wallet.address).then((balance) => balance.toString())
}

export default Balance
