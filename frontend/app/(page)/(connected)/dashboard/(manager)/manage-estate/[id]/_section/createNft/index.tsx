import React from 'react'
import CreateCreateEstateNftDialog from './createCreateEstateNftDialog'

type AddEstateProps = {}

const AddEstate = ({ idEstate, rnbCode, tokenId }: AddEstateProps) => {
	return <CreateCreateEstateNftDialog idEstate={idEstate} rnbCode={rnbCode} tokenId={tokenId} />
}

export default AddEstate
