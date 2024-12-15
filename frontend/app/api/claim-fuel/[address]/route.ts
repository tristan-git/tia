import { NextResponse } from 'next/server'
import Distribute from './utils/distribute'
import { isAddress } from 'ethers'

// skale account 1
// 0x0BeC14837e54F84C4815574967F802a8c3a64d7b
// http://localhost:3000/api/claim-fuel/0xb24c7D59aC6140D7Cca5780a4FbdBbCB6c2F224a

export async function GET(_request: Request, { params }: { params: Promise<{ address: string }> }) {
	const address = (await params).address

	if (!isAddress(address)) return NextResponse.json({ error: 'Invalid Ethereum Address' }, { status: 400 })

	const distribute = await Distribute({ address })

	return NextResponse.json({ distribute }, { status: 400 })
}
