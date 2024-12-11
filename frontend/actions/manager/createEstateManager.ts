'use server'

import { db } from '@/drizzle/db'
import { estateManagersTable, usersTable } from '@/drizzle/schema'

export async function createEstateManager(deploymentData: {
	id: string
	adminId: number
	managerId: number
	rnbCode: string
	factoryId: string
	blockHash: string
	blockNumber: bigint
	transactionHash: string
	timestamp?: Date
	networkTypes: any
}) {
	try {
		await db.insert(estateManagersTable).values({
			id: deploymentData.id,
			adminId: deploymentData.adminId,
			managerId: deploymentData.managerId,
			rnbCode: deploymentData.rnbCode,
			factoryId: deploymentData.factoryId,
			createdAtBlock: deploymentData.blockNumber,
			createdAtTransactionHash: deploymentData.transactionHash,
			createdAtTimestamp: deploymentData.timestamp || new Date(),
			networkTypes: deploymentData.networkTypes || '-',
		})
		return { success: true, message: 'Estate manager created successfully' }
	} catch (error) {
		console.error('Error creating estate manager:', error)
		return { success: false, message: 'Error creating estate manager', error }
	}
}
