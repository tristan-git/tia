'use client'

import React from 'react'
import AllEstateNft from './allEstateNft'

const AllEstateView = () => {
	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='space-y-1'>
					<h2 className='text-2xl font-semibold tracking-tight'>{`Bâtiments`}</h2>
					<p className='text-sm text-muted-foreground'>Retrouver tous les bâtiments auquel vous avez accès</p>
				</div>
			</div>

			<AllEstateNft />
		</>
	)
}

export default AllEstateView
