'use server'

import { db } from '@/drizzle/db'
import { moduleInterventionManagersTable, modulesTable } from '@/drizzle/schema'

export async function assignModule(moduleData: {
	moduleAddress: string
	moduleName: string
	addressEstateManager: string
	blockHash: string
	blockNumber: string
	timestamp: string
	admin: string
}) {
	try {
		await db.insert(modulesTable).values({
			id: moduleData.moduleAddress,
			moduleName: moduleData.moduleName,
			estateManagerId: moduleData.addressEstateManager,
		})

		await db.insert(moduleInterventionManagersTable).values({
			id: moduleData.moduleAddress,
			estateManagerId: moduleData.addressEstateManager,
			admin: moduleData.admin,
			initializedAtTimestamp: moduleData.timestamp,
			initializedAtBlock: moduleData.blockNumber,
			initializedAtTransactionHash: moduleData.blockHash,
		})

		return { success: true, message: 'Module assigned successfully' }
	} catch (error) {
		console.error('Error assigning module:', error)
		return { success: false, message: 'Error assigning module', error }
	}
}
