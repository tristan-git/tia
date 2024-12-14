import React from 'react'
import ValidInterventionDialog from './validInterventionDialog'

type ValidInterventionProps = {
	dataIntervention: any
	disabled: boolean
}

const ValidIntervention = ({ dataIntervention, disabled }: ValidInterventionProps) => {
	return <ValidInterventionDialog dataIntervention={dataIntervention} disabled={disabled} />
}

export default ValidIntervention
