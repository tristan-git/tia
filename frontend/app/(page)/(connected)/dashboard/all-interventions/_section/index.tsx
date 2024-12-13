'use client'

import React from 'react'
import AllInterventions from './allInterventions'

const AllInterventionsView = () => {
	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='space-y-1'>
					<h2 className='text-2xl font-semibold tracking-tight'>{`Interventions`}</h2>
					<p className='text-sm text-muted-foreground'>Retrouver toutes les interventions dont vous avez accées</p>
				</div>
			</div>

			<AllInterventions />
		</>
	)
}

export default AllInterventionsView
