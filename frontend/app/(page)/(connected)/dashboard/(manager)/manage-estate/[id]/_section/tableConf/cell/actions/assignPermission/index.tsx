import React from 'react'
import PermissionDocumentDialog from './permissionDialog'
import PermissionInterventionDialog from './permissionDialog'


type PermissionInterventionProps = {
	dataNft: any
	disabled?: boolean
}

const PermissionIntervention = ({ dataNft, disabled }: PermissionInterventionProps) => {
	return <PermissionInterventionDialog dataNft={dataNft} disabled={disabled} />
}

export default PermissionIntervention
