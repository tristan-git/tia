'use server'

import { db } from '@/drizzle/db'
import { deployments } from '@/drizzle/schema' // Assurez-vous que 'contracts' est le bon nom de votre table

export async function getContractVotes() {
	const results = await db.select().from(deployments)
	// .fields({ address: deployments.fromAddress })
	return results.map((contract) => contract.contractAddress)
}
