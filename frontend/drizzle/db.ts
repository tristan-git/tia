import '@/drizzle/envConfig'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'
import { usersTable2, deployments } from './schema'

export const db = drizzle(sql, { schema })

export const getUsers = async () => {
	const users = await db.select().from(usersTable2)
	return users
}
