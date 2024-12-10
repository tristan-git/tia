import React from 'react'
import AddDocumentDialog from './addDocumentDialog'

type AddDocumentProps = {
	dataIntervention: any
}

const AddDocument = ({ dataIntervention }: AddDocumentProps) => {
	return <AddDocumentDialog dataIntervention={dataIntervention} />
}

export default AddDocument
