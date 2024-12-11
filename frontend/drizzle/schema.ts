import { bigint, integer, pgTable, text, timestamp, uuid, varchar, boolean, uniqueIndex } from 'drizzle-orm/pg-core'

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
	networkTypes: varchar({ length: 255 }).notNull(),
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

export const userInterventionAccessDocumentTable = pgTable(
	'user_intervention_access_document',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		interventionId: integer().notNull(),
		tokenId: bigint('token_id', { mode: 'bigint' }).notNull(),
		indexIntervention: integer().notNull(),
		estateManagerId: varchar({ length: 42 }).notNull(),
		userId: integer(),
		changedBy: integer(),
		hasAccess: boolean().notNull(),
		changedAtTimestamp: timestamp().notNull(),
	},
	(table) => ({
		// Ajout d'un index unique
		uniqueIndex: uniqueIndex('user_intervention_access_document_unique').on(table.interventionId, table.userId, table.estateManagerId),
	})
)

export const userModuleAccessTable = pgTable(
	'user_module_access',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		moduleName: varchar({ length: 255 }).notNull(),
		authorizedAddress: integer()
			.notNull()
			.references(() => usersTable.id),

		tokenId: bigint('token_id', { mode: 'bigint' }).notNull(),
		estateManagerId: varchar({ length: 42 })
			.notNull()
			.references(() => estateManagersTable.id),
		assignedAtTimestamp: timestamp(),
		revokedAtTimestamp: timestamp(),
	},
	(table) => ({
		// Ajout d'un index unique
		uniqueIndex: uniqueIndex('user_module_access_unique').on(
			table.moduleName,
			table.tokenId,
			table.estateManagerId,
			table.authorizedAddress
		),
	})
)
