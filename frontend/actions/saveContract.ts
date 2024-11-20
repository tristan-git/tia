'use server'

import { db } from '@/drizzle/db'
import { deployments } from '@/drizzle/schema'

export async function saveDeployment(deploymentData: {
	blockHash: string
	blockNumber: bigint
	contractAddress: string
	cumulativeGasUsed: bigint
	effectiveGasPrice: bigint
	fromAddress: string
	gasUsed: bigint
	deploymentDate?: Date
}) {
	await db.insert(deployments).values({
		blockHash: deploymentData.blockHash,
		blockNumber: deploymentData.blockNumber,
		contractAddress: deploymentData.contractAddress,
		cumulativeGasUsed: deploymentData.cumulativeGasUsed,
		effectiveGasPrice: deploymentData.effectiveGasPrice,
		fromAddress: deploymentData.fromAddress,
		gasUsed: deploymentData.gasUsed,
		deploymentDate: deploymentData.deploymentDate || new Date(),
	})
}
