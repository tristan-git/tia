import React from 'react'
import PermissionDocumentDialog from './permissionDialog'


type PermissionDocumentProps = {
	dataIntervention: any
	disabled: boolean
}

const PermissionDocument = ({ dataIntervention, disabled }: PermissionDocumentProps) => {
	return <PermissionDocumentDialog dataIntervention={dataIntervention} disabled={disabled} />
}

export default PermissionDocument
