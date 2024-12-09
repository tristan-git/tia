import { db } from '@/drizzle/db'
import { eq } from 'drizzle-orm'
import { accountRolesTable, usersTable } from '@/drizzle/schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { currentAccount, idEstate, tokenId } = body

		console.log('🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡🤡')
		console.log({ currentAccount, idEstate, tokenId })

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

		if (!usersWithRoles[0]?.roleName) {
			return NextResponse.json({ data: [] }, { status: 200 })
		}

		return NextResponse.json({ data: usersWithRoles }, { status: 200 })
	} catch (error) {
		console.error('Erreur de connexion au réseau:', error)
		return NextResponse.json({ message: 'Erreur de connexion au réseau', error: error?.message }, { status: 500 })
	}
}
