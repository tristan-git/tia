// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import './EstateManager.sol';

contract EstateManagerFactory {
	event EstateManagerCreated(address indexed admin, address indexed manager, address estateManager, bytes32 rnbCode);

	address[] public deployedManagers;

	function createEstateManager(address admin, address manager, string memory rnbCode) external returns (address) {
		// Déployer une nouvelle instance d'EstateManager
		EstateManager newManager = new EstateManager(admin, manager, rnbCode);

		// Ajouter l'adresse de l'instance déployée à la liste
		deployedManagers.push(address(newManager));

		// Émettre un événement pour suivre les déploiements
		emit EstateManagerCreated(admin, manager, address(newManager), bytes32(abi.encodePacked(rnbCode)));

		return address(newManager);
	}

	function getDeployedManagers() external view returns (address[] memory) {
		return deployedManagers;
	}
}
