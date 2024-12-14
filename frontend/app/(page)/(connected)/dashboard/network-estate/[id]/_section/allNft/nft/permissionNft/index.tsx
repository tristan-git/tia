import React from 'react'
import CreatePermissionDialog from './createPermissionDialog'

type PermissionNftProps = {
	idEstate: any
	rnbCode: any
	tokenId: any
}

const PermissionNft = ({ idEstate, rnbCode, tokenId }: PermissionNftProps) => {
	return <CreatePermissionDialog idEstate={idEstate} rnbCode={rnbCode} tokenId={tokenId} />
}

export default PermissionNft
