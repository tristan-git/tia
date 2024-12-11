'use server'

import { db } from '@/drizzle/db'
import { userModuleAccessTable, usersTable } from '@/drizzle/schema'
import { sql } from 'drizzle-orm'

export async function assignPrestatairePermission(permissionData: {
	authorizedAddress: string
	moduleName: string
	tokenId: string
	estateManagerId: string
	isGranted: boolean
}) {
	const user = await db
		.select({ id: usersTable.id })
		.from(usersTable)
		.where(sql`LOWER(${usersTable.walletAddress}) = LOWER(${permissionData.authorizedAddress})`)

	try {
		await db
			.insert(userModuleAccessTable)
			.values({
				moduleName: permissionData.moduleName,
				authorizedAddress: user[0].id,
				tokenId: BigInt(permissionData.tokenId),
				estateManagerId: permissionData.estateManagerId,
				assignedAtTimestamp: permissionData.isGranted ? new Date() : null,
				revokedAtTimestamp: !permissionData.isGranted ? new Date() : null,
			})
			.onConflictDoUpdate({
				target: [
					userModuleAccessTable.moduleName,
					userModuleAccessTable.tokenId,
					userModuleAccessTable.estateManagerId,
					userModuleAccessTable.authorizedAddress,
				],
				set: {
					assignedAtTimestamp: permissionData.isGranted ? new Date() : null,
					revokedAtTimestamp: !permissionData.isGranted ? new Date() : null,
				},
			})

		return { success: true, message: 'permission assigned successfully' }
	} catch (error) {
		console.error('Error assigning permission:', error)
		return { success: false, message: 'Error assigning permission', error }
	}
}
