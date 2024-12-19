// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

error InvalidAddress();

interface IModule {
	function execute(uint256 tokenId, string calldata fnName, bytes calldata data, address user) external;
}

contract EstateManager is ERC721URIStorage, AccessControl {
	address private immutable estateManagerFactoryContract;
	bytes32 public immutable rnbCode;
	bytes32 public constant ESTATE_MANAGER_ROLE = keccak256('ESTATE_MANAGER_ROLE');
	uint256 private nextTokenId;

	// modules : module name -> address module contract
	mapping(string => address) private modules;

	// tokenExecuteModuleAccess : tokenId -> moduleName -> authorizedAddress -> boolean
	mapping(uint256 => mapping(string => mapping(address => bool))) private tokenExecuteModuleAccess;

	event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);
	event ModuleRoleAssigned(uint256 indexed tokenId, string indexed moduleName, address indexed authorizedAddress);
	event ModuleRoleRevoked(uint256 indexed tokenId, string indexed moduleName, address indexed authorizedAddress);
	event ModuleRegistered(string indexed moduleName, address indexed moduleAddress);
	event ModuleUpdated(string indexed moduleName, address indexed oldAddress, address indexed newAddress);

	/**
	 * @dev Constructor: initializes admin and manager roles, and assigns the RNB code.
	 * @param _admin Address of the administrator of the new contract.
	 * @param _manager Address of the manager of the new contract.
	 * @param _rnbCode RNB code to identify the collection of buildings.
	 */
	constructor(
		address _admin,
		address _manager,
		address _estateManagerFactoryContract,
		string memory _rnbCode
	) ERC721(string(abi.encodePacked('REALESTATE-', _rnbCode)), 'REALESTATE') {
		nextTokenId = 1;
		rnbCode = bytes32(abi.encodePacked(_rnbCode));
		estateManagerFactoryContract = _estateManagerFactoryContract;

		_grantRole(DEFAULT_ADMIN_ROLE, _admin);
		_grantRole(ESTATE_MANAGER_ROLE, _manager);
	}
	// ////////////////////////////////////////////////////////////////////
	// NFT
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Allows an administrator to mint a new NFT.
	 * @param _to Address of the recipient.
	 * @param _initialURI Initial URI of the token.
	 */
	function mintNFT(address _to, string calldata _initialURI) external onlyRole(ESTATE_MANAGER_ROLE) {
		if (_to == address(0)) revert InvalidAddress();

		uint256 tokenId = nextTokenId;
		_mint(_to, tokenId);
		nextTokenId++;
		_setTokenURI(tokenId, _initialURI);
	}

	/**
	 * @dev Récupère l'URI des métadonnées pour un token spécifique.
	 * @param tokenId ID du token.
	 * @return string URI des métadonnées.
	 */
	function getMetadataURI(uint256 tokenId) external view returns (string memory) {
		return tokenURI(tokenId);
	}

	// ////////////////////////////////////////////////////////////////////
	// MODULE MANAGEMENT
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Registers a new module. Only callable by the factory contract.
	 * @param _moduleName The name of the module (e.g., "InterventionManager").
	 * @param moduleAddress The address of the module to register.
	 */
	function registerModule(string calldata _moduleName, address moduleAddress) external {
		require(msg.sender == estateManagerFactoryContract, 'Unauthorized caller');
		require(moduleAddress != address(0), 'Invalid module address');
		require(modules[_moduleName] == address(0), 'Module already exists');

		modules[_moduleName] = moduleAddress;
		emit ModuleRegistered(_moduleName, moduleAddress);
	}

	/**
	 * @dev Updates an existing module with a new address. Only callable by the factory contract.
	 * @param _moduleName The name of the module to update.
	 * @param newModuleAddress The new address of the module.
	 */
	function updateModule(string calldata _moduleName, address newModuleAddress) external {
		require(msg.sender == estateManagerFactoryContract, 'Unauthorized caller');
		require(newModuleAddress != address(0), 'Invalid module address');
		require(modules[_moduleName] != address(0), 'Module not found');

		address oldAddress = modules[_moduleName];
		modules[_moduleName] = newModuleAddress;
		emit ModuleUpdated(_moduleName, oldAddress, newModuleAddress);
	}

	/**
	 * @dev Retrieves the address of a module by its name.
	 * @param _moduleName The name of the module.
	 * @return The address of the module.
	 */
	function getModule(string calldata _moduleName) external view returns (address) {
		return modules[_moduleName];
	}

	// ////////////////////////////////////////////////////////////////////
	// MODULE ROLES
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Grants execution access for a specific module on a token.
	 * @param tokenId Token ID.
	 * @param moduleName Name of the module (e.g., "InterventionManager").
	 * @param authorizedAddress Address to be granted access.
	 */
	function grantExecuteModuleAccess(
		uint256 tokenId,
		string calldata moduleName,
		address authorizedAddress
	) external onlyRole(ESTATE_MANAGER_ROLE) {
		require(authorizedAddress != address(0), 'Invalid authorized address');
		require(modules[moduleName] != address(0), 'Module not found');

		tokenExecuteModuleAccess[tokenId][moduleName][authorizedAddress] = true;

		// Donne accees au module au manager
		if (tokenExecuteModuleAccess[tokenId][moduleName][msg.sender] == false) {
			tokenExecuteModuleAccess[tokenId][moduleName][msg.sender] = true;
			emit ModuleRoleAssigned(tokenId, moduleName, msg.sender);
		}

		emit ModuleRoleAssigned(tokenId, moduleName, authorizedAddress);
	}

	/**
	 * @dev Revokes execution access for a specific module on a token.
	 * @param tokenId Token ID.
	 * @param moduleName Name of the module (e.g., "InterventionManager").
	 * @param authorizedAddress Address to be revoked.
	 */
	function revokeExecuteModuleAccess(
		uint256 tokenId,
		string calldata moduleName,
		address authorizedAddress
	) external onlyRole(ESTATE_MANAGER_ROLE) {
		require(modules[moduleName] != address(0), 'Module not found');
		require(authorizedAddress != address(0), 'Invalid authorized address');
		require(tokenExecuteModuleAccess[tokenId][moduleName][authorizedAddress], 'Address not authorized');

		tokenExecuteModuleAccess[tokenId][moduleName][authorizedAddress] = false;

		emit ModuleRoleRevoked(tokenId, moduleName, authorizedAddress);
	}

	/**
	 * @dev Checks if an address is authorized to execute a specific module on a token.
	 * @param tokenId Token ID.
	 * @param moduleName Name of the module.
	 * @param user Address to be checked.
	 * @return bool Indicates whether the user is authorized.
	 */
	function hasExecuteModuleAccess(uint256 tokenId, string calldata moduleName, address user) external view returns (bool) {
		return tokenExecuteModuleAccess[tokenId][moduleName][user];
	}

	// ////////////////////////////////////////////////////////////////////
	//  EXECUTE MODULE
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Executes a module after validating permissions.
	 * @param moduleName Name of the module (e.g., "InterventionManager").
	 * @param tokenId ID of the token concerned.
	 * @param fnName Name of the function to call.
	 * @param data Encoded data for execution.
	 */
	function executeModule(string calldata moduleName, uint256 tokenId, string calldata fnName, bytes calldata data) external {
		require(modules[moduleName] != address(0), 'Module not found');
		require(tokenExecuteModuleAccess[tokenId][moduleName][msg.sender], 'Not authorized for this module and token');

		IModule(modules[moduleName]).execute(tokenId, fnName, data, msg.sender);
	}

	// ////////////////////////////////////////////////////////////////////
	// GETTER
	// ////////////////////////////////////////////////////////////////////
	/**
	 * @dev Returns the RNB code of the building or property.
	 * @return string RNB code.
	 */
	function getRnbCode() external view returns (string memory) {
		return string(abi.encodePacked(rnbCode));
	}

	/**
	 * @dev Returns the next token ID.
	 * @return uint256 Next token ID.
	 */
	function getNextTokenId() external view returns (uint256) {
		return nextTokenId;
	}

	// ////////////////////////////////////////////////////////////////////
	// SUPPORTS INTERFACE
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Resolves the conflict for supportsInterface.
	 * @param interfaceId ID of the interface to check.
	 * @return bool Indicates whether the interface is supported.
	 */
	function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
