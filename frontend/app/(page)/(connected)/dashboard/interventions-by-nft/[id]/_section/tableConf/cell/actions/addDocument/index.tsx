import React from 'react'
import AddDocumentDialog from './addDocumentDialog'

type AddDocumentProps = {
	dataIntervention: any
	disabled: boolean
}

const AddDocument = ({ dataIntervention, disabled }: AddDocumentProps) => {
	return <AddDocumentDialog dataIntervention={dataIntervention} disabled={disabled} />
}

export default AddDocument
