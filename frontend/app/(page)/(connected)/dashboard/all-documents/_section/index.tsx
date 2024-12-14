'use client'

import React from 'react'
import AllDocuments from './allDocuments'

const AllDocumentsView = () => {
	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='space-y-1'>
					<h2 className='text-2xl font-semibold tracking-tight'>{`Documents`}</h2>
					<p className='text-sm text-muted-foreground'>Retrouver toutes les documents d'interventions</p>
				</div>
			</div>

			<AllDocuments />
		</>
	)
}

export default AllDocumentsView
