import React from 'react'
import CreateCreateEstateNftDialog from './createCreateEstateNftDialog'

type AddEstateProps = {
	idEstate: any
	rnbCode: any
	tokenId: any
	disabled: any
}

const AddEstate = ({ idEstate, rnbCode, tokenId, disabled }: AddEstateProps) => {
	return <CreateCreateEstateNftDialog idEstate={idEstate} rnbCode={rnbCode} tokenId={tokenId} disabled={disabled} />
}

export default AddEstate
