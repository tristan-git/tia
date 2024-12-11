'use client'

import React, { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InterventionManagerArtifact } from '@/constants/artifacts/InterventionManager'
import { useGetAllUsers } from '@/hooks/queries/users/useGetAllUsers'
import { bucketPath } from '@/constants/bucket'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EyeOpenIcon, FileIcon, ReaderIcon, UploadIcon } from '@radix-ui/react-icons'

/////////////////////////////////////////////////////////
// Document Component
/////////////////////////////////////////////////////////

const DocumentItem = ({ doc, dataIntervention, index, users }: any) => {
	const { documents, estateManagerId, tokenId, indexIntervention } = dataIntervention
	const dataCreated = documents?.[index]?.createdAtTimestamp ? new Date(documents?.[index]?.createdAtTimestamp) : null
	const { firstName, lastName } = users?.filter(({ id }) => documents?.[index]?.createdBy == id)?.[0] || {}
	const fileExtension = documents?.[index]?.fileExtension

	console.log('dataIntervention')
	console.log(doc)

	const file = `${bucketPath}/${estateManagerId}/${tokenId}/interventions/${indexIntervention}/${doc?.documentHash?.slice(
		2
	)}.${fileExtension}`

	const openImageInNewTab = () => {
		window.open(file, '_blank')
	}

	return (
		<div className='p-4  rounded-lg  items-start justify-between space-y-2 flex flex-row  border mb-2'>
			<div className='flex items-start space-x-4'>
				<div className='flex-shrink-0'>
					<div className='p-2 bg-gray-100 rounded-md'>
						<FileIcon className='w-6 h-6 text-gray-500' />
					</div>
				</div>

				<div className='space-y-1'>
					<p className='text-[13px] font-bold uppercase'>
						{doc?.title}
						<span className='block text-xs opacity-50 font-light'>{dataCreated?.toLocaleString()}</span>
					</p>
					<p className='text-xs '>
						<span className='font-semibold'>HASH: </span>
						{doc?.documentHash?.slice(2)}
					</p>

					<p className='text-xs '>
						<span className='font-semibold'>Prestataire: </span>
						{firstName + ' ' + lastName}
					</p>
				</div>
			</div>

			<Button variant='outlineDefault' size='icon' onClick={openImageInNewTab}>
				<UploadIcon />
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
