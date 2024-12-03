import { z } from 'zod'

export const adminUsersSchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	walletAddress: z.string(),
})

export type AdminUsers = z.infer<typeof adminUsersSchema>
