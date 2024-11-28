// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import 'hardhat/console.sol';

interface IModule {
	// Interface pour les modules exécutables
	function execute(uint256 tokenId, string calldata fnName, bytes calldata data, address user) external;
}

contract EstateManager is ERC721URIStorage, AccessControl {
	// TODO licence des contrats
	// TODO modifier les nom de varaible des address en to ou from ?
	// TODO hash dans bytes et pas string
	// TODO verifier les import inutile dans les contrat
	// TODO interface IModuleRegistry et IModule dans dautre fichier ?
	address private immutable estateManagerFactoryContract;
	bytes32 public immutable rnbCode;
	bytes32 public constant ESTATE_MANAGER_ROLE = keccak256('ESTATE_MANAGER_ROLE');

	// Mapping des modules par leur nom
	mapping(string => address) private modules;

	// Mapping des autorisations : tokenId -> moduleName -> authorizedAddress -> boolean
	mapping(uint256 => mapping(string => mapping(address => bool))) private tokenExecuteModuleAccess;

	event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);
	event ModuleRoleAssigned(
		uint256 indexed tokenId,
		string indexed moduleName,
		address indexed authorizedAddress,
		uint256 accessLevel
	);
	event ModuleRoleRevoked(uint256 indexed tokenId, string indexed moduleName, address indexed authorizedAddress);
	event ModuleRegistered(string indexed moduleName, address indexed moduleAddress);
	event ModuleUpdated(string indexed moduleName, address indexed oldAddress, address indexed newAddress);

	/**
	 * @dev Constructeur : initialise les rôles admin et manager, et associe le code RNB.
	 * @param _admin Adresse avec le rôle admin.
	 * @param _manager Adresse avec le rôle manager.
	 * @param _rnbCode Code RNB pour identifier le bâtiment ou la maison.
	 */
	constructor(
		address _admin,
		address _manager,
		address _estateManagerFactoryContract,
		string memory _rnbCode
	) ERC721(string(abi.encodePacked('REALESTATE-', _rnbCode)), 'REALESTATE') {
		require(bytes(_rnbCode).length > 0, 'RNB code is required');
		require(bytes(_rnbCode).length <= 32, 'RNB code must be <= 32 characters');

		rnbCode = bytes32(abi.encodePacked(_rnbCode));
		estateManagerFactoryContract = _estateManagerFactoryContract;

		_grantRole(DEFAULT_ADMIN_ROLE, _admin);
		_grantRole(ESTATE_MANAGER_ROLE, _manager);
	}
	// ////////////////////////////////////////////////////////////////////
	// NFT MANAGEMENT
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Permet au admin de minter un nouveau NFT.
	 * @param to Adresse du bénéficiaire.
	 * @param tokenId ID unique du token.
	 * @param initialURI URI initial du token.
	 */
	function mintNFT(address to, uint256 tokenId, string calldata initialURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
		_mint(to, tokenId);
		_setTokenURI(tokenId, initialURI); // Définit l'URI initial
	}

	/**
	 * @dev Permet de mettre à jour les métadonnées d'un NFT existant.
	 * @param tokenId ID du token à mettre à jour.
	 * @param newMetadataURI Nouvelle URI des métadonnées.
	 */
	function updateMetadata(uint256 tokenId, string calldata newMetadataURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
		// require(_exists(tokenId), 'NFT does not exist');
		_setTokenURI(tokenId, newMetadataURI);
		emit MetadataUpdated(tokenId, newMetadataURI);
	}

	/**
	 * @dev Récupère l'URI des métadonnées pour un token spécifique.
	 * @param tokenId ID du token.
	 * @return string URI des métadonnées.
	 */
	function getMetadataURI(uint256 tokenId) external view returns (string memory) {
		// require(_exists(tokenId), 'NFT does not exist');
		return tokenURI(tokenId);
	}

	// ////////////////////////////////////////////////////////////////////
	// MODULE MANAGEMENT
	// ////////////////////////////////////////////////////////////////////

	function registerModule(string calldata _moduleName, address moduleAddress) external {
		require(msg.sender == estateManagerFactoryContract, 'Unauthorized caller');
		require(moduleAddress != address(0), 'Invalid module address');
		require(modules[_moduleName] == address(0), 'Module already exists');

		modules[_moduleName] = moduleAddress;
		emit ModuleRegistered(_moduleName, moduleAddress);
	}

	function updateModule(string calldata _moduleName, address newModuleAddress) external {
		require(msg.sender == estateManagerFactoryContract, 'Unauthorized caller');
		require(newModuleAddress != address(0), 'Invalid module address');
		require(modules[_moduleName] != address(0), 'Module not found');

		address oldAddress = modules[_moduleName];
		modules[_moduleName] = newModuleAddress;
		emit ModuleUpdated(_moduleName, oldAddress, newModuleAddress);
	}

	function getModule(string calldata _moduleName) external view returns (address) {
		return modules[_moduleName];
	}

	// ////////////////////////////////////////////////////////////////////
	// MODULE ROLES
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Attribue une autorisation d'exécution pour un module spécifique sur un token.
	 * @param tokenId ID du token.
	 * @param moduleName Nom du module (ex: "InterventionManager").
	 * @param authorizedAddress Adresse autorisée.
	 */
	function grantExecuteModuleAccess(
		uint256 tokenId,
		string calldata moduleName,
		address authorizedAddress
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		require(authorizedAddress != address(0), 'Invalid authorized address');

		tokenExecuteModuleAccess[tokenId][moduleName][authorizedAddress] = true;

		emit ModuleRoleAssigned(tokenId, moduleName, authorizedAddress, 2);
	}

	/**
	 * @dev Révoque une autorisation d'exécution pour un module spécifique sur un token.
	 * @param tokenId ID du token.
	 * @param moduleName Nom du module (ex: "InterventionManager").
	 * @param authorizedAddress Adresse à révoquer.
	 */
	function revokeExecuteModuleAccess(
		uint256 tokenId,
		string calldata moduleName,
		address authorizedAddress
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
		require(tokenExecuteModuleAccess[tokenId][moduleName][authorizedAddress], 'Address not authorized');

		tokenExecuteModuleAccess[tokenId][moduleName][authorizedAddress] = false;

		emit ModuleRoleRevoked(tokenId, moduleName, authorizedAddress);
	}

	/**
	 * @dev Vérifie si une adresse est autorisée à exécuter un module spécifique sur un token.
	 * @param tokenId ID du token.
	 * @param moduleName Nom du module.
	 * @param user Adresse à vérifier.
	 * @return bool Indique si l'utilisateur est autorisé.
	 */
	function hasExecuteModuleAccess(uint256 tokenId, string calldata moduleName, address user) external view returns (bool) {
		return tokenExecuteModuleAccess[tokenId][moduleName][user];
	}

	// ////////////////////////////////////////////////////////////////////
	//  EXECUTE MODULE
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Exécute un module après avoir validé les permissions.
	 * @param moduleName Nom du module (ex: "InterventionManager").
	 * @param tokenId ID du token concerné.
	 * @param fnName Nom de la fonction à appeler.
	 * @param data Données encodées pour l'exécution.
	 */
	function executeModule(string calldata moduleName, uint256 tokenId, string calldata fnName, bytes calldata data) public {
		require(modules[moduleName] != address(0), 'Module not found');

		require(tokenExecuteModuleAccess[tokenId][moduleName][msg.sender], 'Not authorized for this module and token');

		IModule(modules[moduleName]).execute(tokenId, fnName, data, msg.sender);
	}

	// ////////////////////////////////////////////////////////////////////
	// SUPPORTS INTERFACE
	// ////////////////////////////////////////////////////////////////////
	/**
	 * @dev Retourne le code RNB du bâtiment ou de la maison.
	 * @return string Code RNB.
	 */
	function getRnbCode() external view returns (string memory) {
		return string(abi.encodePacked(rnbCode));
	}

	// ////////////////////////////////////////////////////////////////////
	// SUPPORTS INTERFACE
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Résout le conflit pour supportsInterface.
	 * @param interfaceId ID de l'interface à vérifier.
	 * @return bool Indique si l'interface est supportée.
	 */
	function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
