// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import './EstateManager.sol';

contract EstateManagerFactory {
	address[] public deployedManagers;

	event FactoryDeployed(address factoryAddress);
	event EstateManagerCreated(address indexed admin, address indexed manager, address estateManager, bytes32 rnbCode);
	event ModuleRegisteredInManager(address indexed estateManager, string name, address moduleAddress);

	constructor() {
		emit FactoryDeployed(address(this));
	}

	/**
	 * @dev Crée un nouveau EstateManager sans enregistrer de module.
	 * @param admin Adresse de l'administrateur.
	 * @param manager Adresse du gestionnaire.
	 * @param rnbCode Code RNB unique.
	 * @return address du nouveau contrat EstateManager.
	 */
	function createEstateManager(address admin, address manager, string memory rnbCode) external returns (address) {
		// Déployer une nouvelle instance d'EstateManager
		EstateManager newManager = new EstateManager(admin, manager, address(this), rnbCode);

		// Ajouter l'adresse de l'instance déployée à la liste
		deployedManagers.push(address(newManager));

		// Émettre un événement pour signaler la création
		emit EstateManagerCreated(admin, manager, address(newManager), bytes32(abi.encodePacked(rnbCode)));

		return address(newManager);
	}

	/**
	 * @dev Enregistre un module dans un EstateManager existant.
	 * @param estateManager Adresse du contrat EstateManager.
	 * @param moduleName Nom du module à enregistrer.
	 * @param moduleAddress Adresse du module.
	 */
	function registerModuleInManager(address estateManager, string memory moduleName, address moduleAddress) external {
		require(estateManager != address(0), 'Invalid EstateManager address');
		require(moduleAddress != address(0), 'Invalid module address');

		// Appeler la fonction registerModule de l'EstateManager
		EstateManager(estateManager).registerModule(moduleName, moduleAddress);

		// Émettre un événement pour signaler l'enregistrement du module
		emit ModuleRegisteredInManager(estateManager, moduleName, moduleAddress);
	}

	function getDeployedManagers() external view returns (address[] memory) {
		return deployedManagers;
	}
}
