'use client'

import React, { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useGetAllUsers } from '@/hooks/queries/users/useGetAllUsers'
import UpdatePermissionDocument from './updatePermissionDocument'
import { ScrollArea } from '@/components/ui/scroll-area'

/////////////////////////////////////////////////////////
// PermissionDocumentDialog
/////////////////////////////////////////////////////////

type PermissionDocumentDialogProps = {
	dataIntervention: any
	disabled: boolean
}

const PermissionDocumentDialog = ({ dataIntervention, disabled }: PermissionDocumentDialogProps) => {
	const [open, setOpen] = useState(false)
	const { data: users } = useGetAllUsers()

	const handleOpenDialog = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setOpen(true)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenuItem disabled={disabled} onClick={handleOpenDialog}>
				Permission documents
			</DropdownMenuItem>

			<DialogContent className='sm:max-w-[700px]'>
				<DialogHeader>
					<DialogTitle>Permission documents</DialogTitle>
					<DialogDescription>{`Qui peut voir les document de l'intervention : ${dataIntervention.title}`}</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-0'>
					<div className='space-y-6'>
						<ScrollArea className='max-h-96'>
							<div className='grid w-full items-center gap-2'>
								{users?.map((user, i) => (
									<UpdatePermissionDocument key={i} user={user} dataIntervention={dataIntervention} />
								))}
							</div>
						</ScrollArea>
					</div>
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={() => setOpen(false)}>
						fermer
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default PermissionDocumentDialog
