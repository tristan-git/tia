'use server'

import { db } from '@/drizzle/db'
import { estateManagersTable, usersTable, modulesTable } from '@/drizzle/schema'
import { eq, or } from 'drizzle-orm'

export async function getManagerEstate() {
	// Étape 1: Récupérer les estate managers
	const estateManagers = await db
		.select({
			id: estateManagersTable.id,
			networkTypes: estateManagersTable.networkTypes,
			managerId: estateManagersTable.managerId,
			adminId: estateManagersTable.adminId,
			rnbCode: estateManagersTable.rnbCode,
			factoryId: estateManagersTable.factoryId,
			createdAtBlock: estateManagersTable.createdAtBlock,
			createdAtTransactionHash: estateManagersTable.createdAtTransactionHash,
			createdAtTimestamp: estateManagersTable.createdAtTimestamp,
		})
		.from(estateManagersTable)

	// Extraire tous les adminId et managerId uniques
	const userIds = Array.from(new Set(estateManagers.flatMap((manager) => [manager.adminId, manager.managerId])))
	const estateManagersId = Array.from(new Set(estateManagers.flatMap((manager) => [manager.id])))

	// Étape 2: Récupérer les utilisateurs correspondants
	const users = await db
		.select({
			id: usersTable.id,
			firstName: usersTable.firstName,
			lastName: usersTable.lastName,
			walletAddress: usersTable.walletAddress,
		})
		.from(usersTable)
		.where(or(...userIds.map((id) => eq(usersTable.id, id))))

	// Étape 3: Récupérer les modules
	const moduleEstate = await db
		.select({
			id: modulesTable.id,
			estateManagerId: modulesTable.estateManagerId,
			moduleName: modulesTable.moduleName,
		})
		.from(modulesTable)
		.where(or(...estateManagersId.map((id) => eq(modulesTable.estateManagerId, id))))

	// Associer les utilisateurs aux estate managers
	const estateManagersWithUsers = estateManagers.map((manager) => ({
		...manager,
		createdAtBlock: manager.createdAtBlock.toString(),
		admin: users.find((user) => user.id === manager.adminId),
		manager: users.find((user) => user.id === manager.managerId),
		modules: moduleEstate?.find(({ estateManagerId }) => estateManagerId === manager.id) || [],
	}))

	return estateManagersWithUsers
}
