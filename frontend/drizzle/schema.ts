import { bigint, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

// export const usersTable = pgTable('users', {
// 	id: integer().primaryKey().generatedAlwaysAsIdentity(),
// 	name: varchar({ length: 255 }).notNull(),
// 	age: integer().notNull(),
// 	email: varchar({ length: 255 }).notNull().unique(),
// })

export const usersTable2 = pgTable('users2', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
})

export const deployments = pgTable('deployments', {
	id: uuid('id').primaryKey().defaultRandom(),
	blockHash: text('block_hash').notNull(),
	blockNumber: bigint('block_number', { mode: 'bigint' }).notNull(),
	contractAddress: text('contract_address').notNull().unique(),
	cumulativeGasUsed: bigint('cumulative_gas_used', { mode: 'bigint' }).notNull(),
	effectiveGasPrice: bigint('effective_gas_price', { mode: 'bigint' }).notNull(),
	fromAddress: text('from_address').notNull(),
	gasUsed: bigint('gas_used', { mode: 'bigint' }).notNull(),
	deploymentDate: timestamp('deployment_date').defaultNow().notNull(),
})
