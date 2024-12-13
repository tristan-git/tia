'use client'

import React, { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useGetAllUsers } from '@/hooks/queries/users/useGetAllUsers'

import { ScrollArea } from '@/components/ui/scroll-area'
import UpdatePermissionIntervention from './updatePermissionDocument'

/////////////////////////////////////////////////////////
// PermissionInterventionDialog
/////////////////////////////////////////////////////////

type PermissionInterventionDialogProps = {
	dataNft: any
	disabled: boolean
}

const PermissionInterventionDialog = ({ dataNft, disabled }: PermissionInterventionDialogProps) => {
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
				Permission interventions
			</DropdownMenuItem>

			<DialogContent className='sm:max-w-[700px]'>
				<DialogHeader>
					<DialogTitle>Permissions interventions</DialogTitle>
					<DialogDescription>Sélectionner les utilisateurs qui peuvent créer des interventions</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-0'>
					<div className='space-y-6'>
						<ScrollArea className={users?.length > 3 ? 'h-[305px]' : 'max-h-fit'}>
							<div className='grid w-full items-center gap-2'>
								{users?.map((user, i) => (
									<UpdatePermissionIntervention key={i} user={user} dataNft={dataNft} />
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

export default PermissionInterventionDialog
