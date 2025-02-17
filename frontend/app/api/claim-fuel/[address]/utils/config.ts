import { parseEther } from 'ethers'

const DISTRIBUTION_VALUE = parseEther('0.01')
const PRIVATE_KEY: string | undefined = process.env.PRIVATE_KEY
const RPC_URL: string | undefined = process.env.RPC_URL

if (!PRIVATE_KEY) throw new Error('Missing Private Key')
if (!RPC_URL) throw new Error('Missing RPC URL')

export { DISTRIBUTION_VALUE, PRIVATE_KEY, RPC_URL }
