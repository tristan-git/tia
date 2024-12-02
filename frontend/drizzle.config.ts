// npx drizzle-kit generate --name=init
// npx drizzle-kit push
// npx drizzle-kit studio

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	// out: './drizzle',
	schema: './drizzle/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL!,
	},
})
