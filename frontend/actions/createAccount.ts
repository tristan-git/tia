'use server'

import Distribute from '@/app/api/claim-fuel/[address]/utils/distribute'
import { db } from '@/drizzle/db'
import { usersTable } from '@/drizzle/schema'

export async function createAccount(deploymentData: { firstName: string; lastName: string; walletAddress: string; accountRoleId: string }) {
	const { firstName, lastName, walletAddress, accountRoleId } = deploymentData

	await Distribute({ address: walletAddress })

	await db.insert(usersTable).values({
		firstName,
		lastName,
		walletAddress,
		accountRoleId: parseInt(accountRoleId),
	})
}
