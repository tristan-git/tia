// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import '@openzeppelin/contracts/access/Ownable.sol';

contract ModuleManager is Ownable(msg.sender) {
	mapping(string => address) private modules;

	event ModuleRegistered(string indexed name, address indexed moduleAddress);
	event ModuleUpdated(string indexed name, address indexed oldAddress, address indexed newAddress);

	function registerModule(string calldata name, address moduleAddress) external onlyOwner {
		require(moduleAddress != address(0), 'Invalid module address');
		require(modules[name] == address(0), 'Module already exists');

		modules[name] = moduleAddress;
		emit ModuleRegistered(name, moduleAddress);
	}

	function updateModule(string calldata name, address newModuleAddress) external onlyOwner {
		require(newModuleAddress != address(0), 'Invalid module address');
		require(modules[name] != address(0), 'Module not found');

		address oldAddress = modules[name];
		modules[name] = newModuleAddress;
		emit ModuleUpdated(name, oldAddress, newModuleAddress);
	}

	function getModule(string calldata name) external view returns (address) {
		return modules[name];
	}
}
