'use server'

import { db } from '@/drizzle/db'
import { usersTable } from '@/drizzle/schema'

export async function createAccount(deploymentData: { firstName: string; lastName: string; walletAddress: string; accountRoleId: string }) {
	const { firstName, lastName, walletAddress, accountRoleId } = deploymentData
	await db.insert(usersTable).values({
		firstName,
		lastName,
		walletAddress,
		accountRoleId: parseInt(accountRoleId),
	})
}
