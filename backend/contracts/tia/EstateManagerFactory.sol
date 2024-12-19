// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import './EstateManager.sol';

error AdminAddressZero();
error ManagerAddressZero();
error EstateManagerAddressZero();
error ModuleAddressZero();
error InvalidRnbCode();
error ModuleNameRequired();

contract EstateManagerFactory {
	address[] public deployedManagers;

	event FactoryDeployed(address indexed factoryAddress);
	event EstateManagerCreated(address indexed admin, address indexed manager, address indexed estateManager, bytes32 rnbCode);
	event ModuleRegisteredInManager(address indexed estateManager, string moduleName, address moduleAddress);

	constructor() {
		emit FactoryDeployed(address(this));
	}

	/**
	 * @notice Creates a new `EstateManager` contract.
	 * @param _admin Address of the administrator of the new contract.
	 * @param _manager Address of the manager of the new contract.
	 * @param _rnbCode RNB code to identify the collection of buildings.
	 */
	function createEstateManager(address _admin, address _manager, string memory _rnbCode) external {
		if (_admin == address(0)) revert AdminAddressZero();
		if (_manager == address(0)) revert ManagerAddressZero();
		if (bytes(_rnbCode).length == 0 || bytes(_rnbCode).length > 32) revert InvalidRnbCode();

		// Deploy a new instance of EstateManager
		EstateManager newManager = new EstateManager(_admin, _manager, address(this), _rnbCode);

		// Add the address of the deployed instance to the list
		deployedManagers.push(address(newManager));

		emit EstateManagerCreated(_admin, _manager, address(newManager), bytes32(abi.encodePacked(_rnbCode)));
	}

	/**
	 * @notice Registers a module in an existing `EstateManager` contract.
	 * @param _estateManager Address of the `EstateManager` contract.
	 * @param _moduleName Name of the module to register.
	 * @param _moduleAddress Address of the module to register.
	 */
	function registerModuleInManager(address _estateManager, string memory _moduleName, address _moduleAddress) external {
		if (_estateManager == address(0)) revert EstateManagerAddressZero();
		if (_moduleAddress == address(0)) revert ModuleAddressZero();
		if (bytes(_moduleName).length == 0) revert ModuleNameRequired();

		// Register the module in the EstateManager contract
		EstateManager(_estateManager).registerModule(_moduleName, _moduleAddress);

		emit ModuleRegisteredInManager(_estateManager, _moduleName, _moduleAddress);
	}
}
