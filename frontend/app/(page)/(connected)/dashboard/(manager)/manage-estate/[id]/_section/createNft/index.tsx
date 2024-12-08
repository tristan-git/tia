import React from 'react'
import CreateCreateEstateNftDialog from './createCreateEstateNftDialog'

type AddEstateProps = {
	idEstate: any
	rnbCode: any
	tokenId: any
}

const AddEstate = ({ idEstate, rnbCode, tokenId }: AddEstateProps) => {
	return <CreateCreateEstateNftDialog idEstate={idEstate} rnbCode={rnbCode} tokenId={tokenId} />
}

export default AddEstate
