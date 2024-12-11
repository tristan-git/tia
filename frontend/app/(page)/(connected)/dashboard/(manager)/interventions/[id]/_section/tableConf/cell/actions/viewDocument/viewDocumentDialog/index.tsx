'use client'

import React, { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { File } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'
import { useGetAllUsers } from '@/hooks/queries/users/useGetAllUsers'
import { bucketPath } from '@/constants/bucket'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EyeOpenIcon, ReaderIcon } from '@radix-ui/react-icons'

/////////////////////////////////////////////////////////
// Document Component
/////////////////////////////////////////////////////////

const DocumentItem = ({ doc, dataIntervention, index, users }: any) => {
	const { documents, estateManagerId, tokenId, indexIntervention } = dataIntervention
	const dataCreated = documents?.[index]?.createdAtTimestamp ? new Date(documents?.[index]?.createdAtTimestamp) : null
	const { firstName, lastName } = users?.filter(({ id }) => documents?.[index]?.createdBy == id)?.[0] || {}
	const fileExtension = documents?.[index]?.fileExtension

	const file = `${bucketPath}/${estateManagerId}/${tokenId}/interventions/${indexIntervention}/${doc?.documentHash?.slice(
		2
	)}.${fileExtension}`

	const openImageInNewTab = () => {
		window.open(file, '_blank')
	}

	return (
		<div className='space-y-2 flex flex-row items-center justify-between rounded-lg border p-4 mb-2'>
			<div className='space-y-0.5'>
				<p className='font-bold peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm'>
					{doc?.title} <span className='text-xs font-light text-muted-foreground'> {dataCreated?.toLocaleString()}</span>
				</p>
				<p className='font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs'>
					<span className='text-xs font-bold'>HASH : </span>
					<span className='text-muted-foreground'>{doc?.documentHash?.slice(2)}</span>
				</p>

				{firstName && lastName && (
					<p className='font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs'>
						<span className='text-xs font-bold'>Ajouté par : </span>
						<span className='text-muted-foreground'>{firstName + ' ' + lastName}</span>
					</p>
				)}
			</div>

			<Button variant='outline' size='icon' onClick={openImageInNewTab}>
				<File />
			</Button>
		</div>
	)
}

/////////////////////////////////////////////////////////
// ViewDocumentDialog
/////////////////////////////////////////////////////////

type ViewDocumentDialogProps = {
	dataInter: any
	disabled: boolean
}

const ViewDocumentDialog = ({ dataInter, disabled }: ViewDocumentDialogProps) => {
	const [open, setOpen] = useState(false)
	const { address: currentAccount } = useAccount()
	const { data: users } = useGetAllUsers()
	const walletPrestataire = users?.filter(({ accountRoleId }) => accountRoleId == dataInter?.createdBy)?.[0]?.walletAddress

	/////////////////////////////////////////////////////////
	// Request Blockchain
	/////////////////////////////////////////////////////////

	const { data } = useReadContract({
		abi: InterventionManagerArtifact.abi,
		address: dataInter?.moduleId,
		functionName: 'getInterventions',
		args: [BigInt(dataInter?.tokenId), walletPrestataire as `0x${string}`],
		account: currentAccount,
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' size='xs'>
					<ReaderIcon />
					{`${data?.[dataInter?.indexIntervention]?.documents?.length} Documents`}
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-[700px]'>
				<DialogHeader>
					<DialogTitle>{`Documents : ${dataInter.title}`}</DialogTitle>
					<DialogDescription>Retrouver tous les documents envoyer par le prestataire</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-0'>
					<div className='grid w-full items-center gap-2'>
						{data?.[dataInter?.indexIntervention]?.documents?.length ? (
							<ScrollArea className={data?.[dataInter?.indexIntervention]?.documents?.length > 3 ? 'h-[305px]' : 'max-h-fit'}>
								{data?.[dataInter?.indexIntervention]?.documents?.map((doc, i) => (
									<DocumentItem key={i} doc={doc} dataIntervention={dataInter} index={i} users={users} />
								))}
							</ScrollArea>
						) : (
							<div className='flex h-[200px] shrink-0 items-center justify-center rounded-md border border-dashed'>
								<div className='mx-auto flex max-w-[420px] flex-col items-center justify-center text-center'>
									<h3 className='mt-4 text-lg font-semibold'>Aucun document</h3>
									<p className='mb-4 mt-2 text-sm text-muted-foreground'>Les intervenants n'ont pas encore ajouter de documents</p>
								</div>
							</div>
						)}
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

export default ViewDocumentDialog
