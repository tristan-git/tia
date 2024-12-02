import { db } from '@/drizzle/db'
import { eq } from 'drizzle-orm'
import { accountRolesTable, usersTable } from '@/drizzle/schema'
import { NextResponse } from 'next/server'

export async function POST(req) {
	try {
		const body = await req.json()
		const { currentAccount } = body

		const usersWithRoles = await db
			.select({
				userId: usersTable.id,
				firstName: usersTable.firstName,
				lastName: usersTable.lastName,
				walletAddress: usersTable.walletAddress,
				roleName: accountRolesTable.name,
			})
			.from(usersTable)
			.leftJoin(accountRolesTable, eq(accountRolesTable.id, usersTable.accountRoleId))
			.where(eq(usersTable.walletAddress, currentAccount))

		if (usersWithRoles.length === 1) {
			// Redirection côté serveur vers une page spécifique
			return NextResponse.redirect(new URL('/not-found', req.url)) // Redirige vers la page /not-found
		}

		return NextResponse.json({ data: usersWithRoles }, { status: 200 }) // Retourne les données filtrées
	} catch (error) {
		console.error('Erreur de connexion au réseau:', error)
		return NextResponse.json({ message: 'Erreur de connexion au réseau', error: error?.message }, { status: 500 })
	}
}
