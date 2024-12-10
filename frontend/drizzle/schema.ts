import { bigint, integer, pgTable, text, timestamp, uuid, varchar, boolean } from 'drizzle-orm/pg-core'

// export const usersTable = pgTable('users', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 255 }).notNull(),
// 	age: integer().notNull(),
// 	email: varchar({ length: 255 }).notNull().unique(),
// })

// export const usersTable2 = pgTable('users2', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 255 }).notNull(),
// 	age: integer().notNull(),
// 	email: varchar({ length: 255 }).notNull().unique(),
// })

// export const deployments = pgTable('deployments', {
// 	id: uuid('id').primaryKey().defaultRandom(),
// 	blockHash: text('block_hash').notNull(),
// 	blockNumber: bigint('block_number', { mode: 'bigint' }).notNull(),
// 	contractAddress: text('contract_address').notNull().unique(),
// 	cumulativeGasUsed: bigint('cumulative_gas_used', { mode: 'bigint' }).notNull(),
// 	effectiveGasPrice: bigint('effective_gas_price', { mode: 'bigint' }).notNull(),
// 	fromAddress: text('from_address').notNull(),
// 	gasUsed: bigint('gas_used', { mode: 'bigint' }).notNull(),
// 	deploymentDate: timestamp('deployment_date').defaultNow().notNull(),
// })

export const accountRolesTable = pgTable('account_roles', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 50 }).notNull(),
})

export const usersTable = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	firstName: varchar({ length: 255 }).notNull(),
	lastName: varchar({ length: 255 }).notNull(),
	walletAddress: varchar({ length: 42 }).notNull().unique(),
	accountRoleId: integer()
		.notNull()
		.references(() => accountRolesTable.id),
})

export const estateManagersTable = pgTable('estate_managers', {
	id: varchar({ length: 42 }).primaryKey(),
	adminId: integer()
		.notNull()
		.references(() => usersTable.id),
	managerId: integer()
		.notNull()
		.references(() => usersTable.id),
	rnbCode: varchar({ length: 255 }).notNull(),
	factoryId: varchar({ length: 42 }).notNull(),
	createdAtBlock: bigint('created_at_block', { mode: 'bigint' }).notNull(),
	createdAtTransactionHash: varchar({ length: 255 }).notNull(),
	createdAtTimestamp: timestamp().notNull(),
})

export const mintedNFTsTable = pgTable('minted_nfts', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	tokenId: bigint('token_id', { mode: 'bigint' }).notNull(),
	estateManagerId: varchar({ length: 42 })
		.notNull()
		.references(() => estateManagersTable.id),
	ownerAddress: integer()
		.notNull()
		.references(() => usersTable.id),
	metadataURI: text('metadata_url').notNull(),
	createdAtTimestamp: timestamp().notNull(),
	mintedBy: integer()
		.notNull()
		.references(() => usersTable.id),
	transactionHash: varchar({ length: 255 }),
	addressInterventionManager: varchar({ length: 255 }).notNull(),
	address: varchar({ length: 255 }).notNull(),
	town: varchar({ length: 255 }).notNull(),
	img: varchar({ length: 255 }).notNull(),
})

export const modulesTable = pgTable('modules', {
	id: varchar({ length: 42 }).primaryKey(),
	moduleName: varchar({ length: 255 }).notNull(),
	estateManagerId: varchar({ length: 42 })
		.notNull()
		.references(() => estateManagersTable.id),
})

export const moduleInterventionManagersTable = pgTable('module_intervention_managers', {
	id: varchar({ length: 42 }).primaryKey(),
	estateManagerId: varchar({ length: 42 })
		.notNull()
		.references(() => estateManagersTable.id),
	admin: varchar({ length: 42 }).notNull(),
	initializedAtTimestamp: timestamp().notNull(),
	initializedAtBlock: bigint('initialized_at_block', { mode: 'bigint' }).notNull(),
	initializedAtTransactionHash: varchar({ length: 255 }).notNull(),
})

export const interventionsTable = pgTable('interventions', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	tokenId: bigint('token_id', { mode: 'bigint' }).notNull(),
	indexIntervention: integer().notNull(),
	title: varchar({ length: 255 }).notNull(),
	isValidated: boolean().default(false),
	validateFrom: integer().references(() => usersTable.id),
	estateManagerId: varchar({ length: 42 })
		.notNull()
		.references(() => estateManagersTable.id),
	createdAtTimestamp: timestamp().notNull(),
	createdBy: integer()
		.notNull()
		.references(() => usersTable.id),
})

export const documentsTable = pgTable('documents', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	interventionId: integer()
		.notNull()
		.references(() => interventionsTable.id),
	title: varchar({ length: 255 }).notNull(),
	documentHash: varchar({ length: 255 }).notNull(),
	fileExtension: varchar({ length: 255 }).notNull(),
	createdAtTimestamp: timestamp().notNull(),
	createdBy: integer()
		.notNull()
		.references(() => usersTable.id),
})

export const userInterventionAccessTable = pgTable('user_intervention_access', {
	id: bigint('id', { mode: 'bigint' }).primaryKey(),
	interventionId: bigint('intervention_id', { mode: 'bigint' })
		.notNull()
		.references(() => interventionsTable.id),
	moduleId: varchar({ length: 42 })
		.notNull()
		.references(() => modulesTable.id),
	tokenId: bigint('token_id', { mode: 'bigint' }).notNull(),
	userId: integer()
		.notNull()
		.references(() => usersTable.id),
	hasAccess: boolean().notNull(),
	changedAtTimestamp: timestamp().notNull(),
})

export const userModuleAccessTable = pgTable('user_module_access', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	moduleName: varchar({ length: 255 }).notNull(),
	authorizedAddress: integer()
		.notNull()
		.references(() => usersTable.id),

	tokenId: bigint('token_id', { mode: 'bigint' }).notNull(),
	estateManagerId: varchar({ length: 42 })
		.notNull()
		.references(() => estateManagersTable.id),
	assignedAtTimestamp: timestamp().notNull(),
	revokedAtTimestamp: timestamp(),
})

// export const interventionAccessChangesTable = pgTable('intervention_access_changes', {
// 	id: bigint().primaryKey(),
// 	interventionId: bigint()
// 	  .notNull()
// 	  .references(() => interventionsTable.id), // Référence à `interventions`
// 	moduleId: varchar({ length: 42 })
// 	  .notNull()
// 	  .references(() => modulesTable.id), // Référence à `modules`
// 	tokenId: bigint().notNull(),
// 	account: varchar({ length: 42 }).notNull(),
// 	hasAccess: boolean().notNull(),
// 	changedAtTimestamp: bigint().notNull(),
// 	changedBy: varchar({ length: 42 })
// 	  .notNull()
// 	  .references(() => usersTable.id), // Référence à `users`
//   })
