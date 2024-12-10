'use server'

import { db } from '@/drizzle/db'
import { userModuleAccessTable, usersTable } from '@/drizzle/schema'
import { sql } from 'drizzle-orm'

export async function assignPrestatairePermission(permissionData: {
	authorizedAddress: string
	moduleName: string
	tokenId: string
	estateManagerId: string
}) {
	const user = await db
		.select({ id: usersTable.id })
		.from(usersTable)
		.where(sql`LOWER(${usersTable.walletAddress}) = LOWER(${permissionData.authorizedAddress})`)

	try {
		await db.insert(userModuleAccessTable).values({
			moduleName: permissionData.moduleName,
			assignedAtTimestamp: new Date(),
			authorizedAddress: user[0].id,
			tokenId: BigInt(permissionData.tokenId),
			estateManagerId: permissionData.estateManagerId,
		})

		return { success: true, message: 'permission assigned successfully' }
	} catch (error) {
		console.error('Error assigning permission:', error)
		return { success: false, message: 'Error assigning permission', error }
	}
}
