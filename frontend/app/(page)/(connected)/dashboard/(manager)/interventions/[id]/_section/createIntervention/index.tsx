import React from 'react'
import CreateInterventionDialog from './createInterventionDialog'

type AddEstateProps = {
	idEstate: any
	tokenId: any
	addressInterventionManager: any
	disabled: any
}

const CreateIntervention = ({ idEstate, tokenId, addressInterventionManager, disabled }: AddEstateProps) => {
	return (
		<CreateInterventionDialog
			idEstate={idEstate}
			tokenId={tokenId}
			addressInterventionManager={addressInterventionManager}
			disabled={disabled}
		/>
	)
}

export default CreateIntervention
