import React from 'react'
import ValidInterventionDialog from './validInterventionDialog'

type ValidInterventionProps = {
	dataIntervention: any
}

const ValidIntervention = ({ dataIntervention }: ValidInterventionProps) => {
	return <ValidInterventionDialog dataIntervention={dataIntervention} />
}

export default ValidIntervention
