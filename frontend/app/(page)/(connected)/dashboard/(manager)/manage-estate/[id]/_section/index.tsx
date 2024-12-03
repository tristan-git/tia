'use client'

import React, { useCallback, useMemo, useEffect } from 'react'
import AddEstate from './addEstate'

type MyEstatesProps = { idEstate: string }

const MyEstates = ({ idEstate }: MyEstatesProps) => {
	return (
		<div className=''>
			<AddEstate idEstate={idEstate} />
		</div>
	)
}

export default MyEstates
