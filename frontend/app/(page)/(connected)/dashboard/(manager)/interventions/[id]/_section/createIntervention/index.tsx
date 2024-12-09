import React from 'react'
import CreateInterventionDialog from './createInterventionDialog'

type AddEstateProps = {
	idEstate: any
	tokenId: any
	addressInterventionManager: any
}

const CreateIntervention = ({ idEstate, tokenId, addressInterventionManager }: AddEstateProps) => {
	return <CreateInterventionDialog idEstate={idEstate} tokenId={tokenId} addressInterventionManager={addressInterventionManager} />
}

export default CreateIntervention
