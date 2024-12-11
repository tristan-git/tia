'use client'

import React, { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import UpdateModule from './updateModule'

/////////////////////////////////////////////////////////
// List module
/////////////////////////////////////////////////////////

const listModule = [
	{
		id: 1,
		title: 'Module intervention',
		subTitle: 'Description du module intervention',
		Icon: '',
		moduleName: 'InterventionManager',
	},
	{
		id: 2,
		title: 'Module autre 1',
		subTitle: 'Description du module autre 1',
		Icon: '',
		moduleName: 'EmptyModule',
	},
	{
		id: 3,
		title: 'Module autre 2',
		subTitle: 'Description du module autre 2',
		Icon: '',
		moduleName: 'EmptyModule',
	},
]

/////////////////////////////////////////////////////////
// AssignModuleDialog
/////////////////////////////////////////////////////////

type AssignModuleDialogProps = {
	setOpenMenu?: any
	contractAddress?: boolean
	disabled?: boolean
}

const AssignModuleDialog = ({ setOpenMenu, contractAddress, disabled }: AssignModuleDialogProps) => {
	const [open, setOpen] = useState(false)

	const handleOpenDialog = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setOpen(true)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenuItem disabled={disabled} onClick={handleOpenDialog}>
				Assigner des modules
			</DropdownMenuItem>

			<DialogContent className='sm:max-w-[700px]'>
				<DialogHeader>
					<DialogTitle>Assigner des modules</DialogTitle>
					<DialogDescription>{`Assigner des modules explication`}</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-0'>
					<div className='space-y-6'>
						<ScrollArea className='h-[280px]'>
							<div className='grid w-full items-center gap-2'>
								{listModule?.map((moduleData, i) => (
									<UpdateModule key={i} moduleData={moduleData} contractAddress={contractAddress} />
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

export default AssignModuleDialog
