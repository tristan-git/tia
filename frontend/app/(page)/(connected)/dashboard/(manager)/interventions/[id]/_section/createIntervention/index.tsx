import React from 'react'
import CreateCreateEstateNftDialog from './createInterventionDialog'
import CreateInterventionDialog from './createInterventionDialog'

type AddEstateProps = {
	idEstate: any
	tokenId: any
}

const CreateIntervention = ({ idEstate, tokenId }: AddEstateProps) => {
	return <CreateInterventionDialog idEstate={idEstate} tokenId={tokenId} />
}

export default CreateIntervention
