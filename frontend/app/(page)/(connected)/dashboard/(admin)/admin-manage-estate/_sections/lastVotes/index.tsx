'use client'
import { Metadata } from 'next'
import Image from 'next/image'
import { CircleUser, PlusCircle } from 'lucide-react'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CustomBadge from '@/components/shared/_ui/badge'
import { statusVotes } from '@/constants/statusVotes'
import { useAccount } from 'wagmi'

export default function LastVotes({ votes }) {
	const { address: addressConnected } = useAccount()
	return (
		<>
			<div className='flex items-center justify-between'>
				<div className='space-y-1'>
					<h2 className='text-2xl font-semibold tracking-tight'>Les dernier votes publier</h2>
					<p className='text-sm text-muted-foreground'>Balbal ici sous texte vote.</p>
				</div>
			</div>

			<div className='relative'>
				<ScrollArea className='whitespace-nowrap container'>
					<div className='flex space-x-4 pb-4'>
						{votes?.map(({ contractName, address, workflowStatus, owner }, i) => (
							<Card key={address}>
								<CardHeader>
									<div className='flex justify-between items-center space-x-2'>
										<CardTitle>{`${contractName} ${i + 1}`}</CardTitle>
										<div className='flex justify-between items-center space-x-2'>
											{addressConnected == owner && (
												<div className='flex aspect-square size-5 items-center justify-center rounded-lg bg-lime-200 text-gray-950'>
													<CircleUser className='h-3 w-3 rounded-lg' />
												</div>
											)}

											<CustomBadge text={statusVotes?.[workflowStatus]?.text} variant={statusVotes?.[workflowStatus]?.variant} />
										</div>
									</div>

									<CardDescription className='max-w-[240px] truncate'>{address}</CardDescription>
								</CardHeader>
								<CardContent>
									<p className='text-xs'>{owner}</p>
								</CardContent>
								{/* <CardFooter>
									<p className='text-xs'>{data.owner.value}</p>
								</CardFooter> */}
							</Card>
						))}
					</div>
					<ScrollBar orientation='horizontal' />
				</ScrollArea>
			</div>
		</>
	)
}
