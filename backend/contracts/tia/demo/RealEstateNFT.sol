// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import 'hardhat/console.sol';

interface IModule {
	// Interface pour les modules exécutables
	function execute(uint256 tokenId, string calldata fnName, bytes calldata data) external;
}

interface IModuleRegistry {
	// Interface pour le registre de modules
	function getModule(string calldata name) external view returns (address);
}

contract RealEstateNFT is ERC721URIStorage, AccessControl {
	// TODO ajouter une constante initialiser dans constructeur pour le code RNB
	// TODO hash dans bytes et pas string
	// TODO deployer automatiquement au constructeur moduleManager address
	// TODO contrat pausable
	// TODO enum des role et essayer den mettre le max qui couvre tout les cas
	// TODO verifier les import inutile dans les contrat
	// TODO variable multiproperty ex immeuble avec plusieur appart !!! nft 1 par defaut gere lensemble des appartement
	// TODO plusieur manager peuvent travailler separement 

	// Rôle pour gérer les fonctionnalités de manager
	bytes32 public constant MANAGER_ROLE = keccak256('MANAGER_ROLE');

	// Adresse du gestionnaire de modules
	address private moduleManager;

	// Structure pour gérer les autorisations spécifiques par module et token
	struct ModuleAccess {
		bool isAuthorized; // Indique si l'adresse est autorisée
		uint256 accessLevel; // Niveau d'accès : 1 (lecture), 2 (écriture)
	}

	// TODO rennomer en tokenModuleRolesAccessPermission ou autre chose ?
	// Mapping des autorisations : tokenId -> moduleName -> authorizedAddress -> ModuleAccess
	mapping(uint256 => mapping(string => mapping(address => ModuleAccess))) private tokenModuleRoles;

	// Événements pour tracer les changements
	event ModuleManagerUpdated(address indexed oldManager, address indexed newManager);
	event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);
	event ModuleRoleAssigned(
		uint256 indexed tokenId,
		string indexed moduleName,
		address indexed authorizedAddress,
		uint256 accessLevel
	);
	event ModuleRoleRevoked(uint256 indexed tokenId, string indexed moduleName, address indexed authorizedAddress);

	/**
	 * @dev Constructeur : initialise les rôles admin et manager.
	 * @param _admin Adresse avec le rôle admin.
	 * @param _manager Adresse avec le rôle manager.
	 */
	constructor(address _admin, address _manager) ERC721('RealEstateNFT', 'REALESTATE') {
		_grantRole(DEFAULT_ADMIN_ROLE, _admin);
		_grantRole(MANAGER_ROLE, _manager);
	}

	// ////////////////////////////////////////////////////////////////////
	// NFT MANAGEMENT
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Permet au manager de minter un nouveau NFT.
	 * @param to Adresse du bénéficiaire.
	 * @param tokenId ID unique du token.
	 * @param initialURI URI initial du token.
	 */
	function mintNFT(address to, uint256 tokenId, string calldata initialURI) public onlyRole(MANAGER_ROLE) {
		_mint(to, tokenId);
		_setTokenURI(tokenId, initialURI); // Définit l'URI initial
	}

	/**
	 * @dev Permet de mettre à jour les métadonnées d'un NFT existant.
	 * @param tokenId ID du token à mettre à jour.
	 * @param newMetadataURI Nouvelle URI des métadonnées.
	 */
	function updateMetadata(uint256 tokenId, string calldata newMetadataURI) external onlyRole(MANAGER_ROLE) {
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
	// MODULE MANAGER
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Met à jour le gestionnaire de modules (moduleManager).
	 * @param _newManager Adresse du nouveau gestionnaire de modules.
	 */
	function updateModuleManager(address _newManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
		require(_newManager != address(0), 'Invalid module manager address');
		address oldManager = moduleManager;
		moduleManager = _newManager;
		emit ModuleManagerUpdated(oldManager, _newManager);
	}

	// ////////////////////////////////////////////////////////////////////
	// MODULE ROLES
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Assigne un rôle pour un module spécifique sur un token.
	 * @param tokenId ID du token.
	 * @param moduleName Nom du module (ex: "InterventionManager").
	 * @param authorizedAddress Adresse autorisée.
	 * @param accessLevel Niveau d'accès (1: lecture, 2: écriture).
	 */
	function assignModuleRole(
		uint256 tokenId,
		string calldata moduleName,
		address authorizedAddress,
		uint256 accessLevel
	) external onlyRole(MANAGER_ROLE) {
		require(authorizedAddress != address(0), 'Invalid authorized address');
		require(accessLevel > 0, 'Invalid access level');

		tokenModuleRoles[tokenId][moduleName][authorizedAddress] = ModuleAccess({isAuthorized: true, accessLevel: accessLevel});

		emit ModuleRoleAssigned(tokenId, moduleName, authorizedAddress, accessLevel);
	}

	/**
	 * @dev Révoque un rôle pour un module spécifique sur un token.
	 * @param tokenId ID du token.
	 * @param moduleName Nom du module (ex: "InterventionManager").
	 * @param authorizedAddress Adresse à révoquer.
	 */
	function revokeModuleRole(
		uint256 tokenId,
		string calldata moduleName,
		address authorizedAddress
	) external onlyRole(MANAGER_ROLE) {
		require(tokenModuleRoles[tokenId][moduleName][authorizedAddress].isAuthorized, 'Address not authorized');

		delete tokenModuleRoles[tokenId][moduleName][authorizedAddress];

		emit ModuleRoleRevoked(tokenId, moduleName, authorizedAddress);
	}

	/**
	 * @dev Récupère les informations d'accès pour une adresse.
	 * @param tokenId ID du token.
	 * @param moduleName Nom du module.
	 * @param authorizedAddress Adresse à vérifier.
	 * @return bool Indique si l'adresse est autorisée.
	 * @return uint256 Niveau d'accès de l'adresse.
	 */
	function getModuleAccess(
		uint256 tokenId,
		string calldata moduleName,
		address authorizedAddress
	) external view returns (bool, uint256) {
		ModuleAccess memory access = tokenModuleRoles[tokenId][moduleName][authorizedAddress];
		return (access.isAuthorized, access.accessLevel);
	}

	// ////////////////////////////////////////////////////////////////////
	// MODULE EXECUTION
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Exécute un module après avoir validé les permissions.
	 * @param moduleName Nom du module (ex: "InterventionManager").
	 * @param tokenId ID du token concerné.
	 * @param fnName Nom de la fonction à appeler.
	 * @param data Données encodées pour l'exécution.
	 */
	function executeModule(string calldata moduleName, uint256 tokenId, string calldata fnName, bytes calldata data) public {
		// Vérifiez que moduleManager est configuré
		require(moduleManager != address(0), 'ModuleManager not set');

		// Récupérez les permissions pour msg.sender
		ModuleAccess memory access = tokenModuleRoles[tokenId][moduleName][msg.sender];

		// Valider les permissions
		require(access.isAuthorized && access.accessLevel == 2, 'Not authorized for this module and token');

		// Récupérer l'adresse du module via le gestionnaire de modules
		address module = IModuleRegistry(moduleManager).getModule(moduleName);
		require(module != address(0), 'Module not found');

		// Appeler la fonction `execute` sur le module
		IModule(module).execute(tokenId, fnName, data);
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

// pragma solidity 0.8.28;

// import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
// import '@openzeppelin/contracts/access/Ownable.sol';
// import {AccessControl} from '@openzeppelin/contracts/access/AccessControl.sol';

// import 'hardhat/console.sol';

// interface IModule {
// 	function execute(uint256 tokenId, string calldata fnName, bytes calldata data) external;
// }

// interface IModuleRegistry {
// 	function getModule(string calldata name) external view returns (address);
// }

// contract RealEstateNFT is ERC721URIStorage, AccessControl {
// 	bytes32 public constant MANAGER_ROLE = keccak256('MANAGER_ROLE');

// 	address private moduleManager;

// 	mapping(uint256 => string) private metadataURIs; // Stockage des URI de métadonnées

// 	struct ModuleAccess {
// 		bool isAuthorized; // Indique si l'adresse est autorisée
// 		uint256 accessLevel; // Niveau d'accès ou rôle -> Niveau 1 : Lecture seule | Niveau  : Lecture et écriture.
// 	}

// 	// Structure pour gérer les autorisations spécifiques par module et token
// 	mapping(uint256 => mapping(string => mapping(address => ModuleAccess))) private tokenModuleRoles; // tokenId -> moduleName -> authorizedAddress -> ModuleAccess

// 	event ModuleManagerUpdated(address indexed oldManager, address indexed newManager);
// 	event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);
// 	event ModuleRoleAssigned(uint256 indexed tokenId, string indexed moduleName, address indexed authorizedAddress);

// 	constructor(address _admin, address _manager) ERC721('RealEstateNFT', 'REALESTATE') {
// 		_grantRole(DEFAULT_ADMIN_ROLE, _admin);
// 		_grantRole(MANAGER_ROLE, _manager);
// 	}

// 	// ////////////////////////////////////////////////////////////////////
// 	// NFT
// 	// ////////////////////////////////////////////////////////////////////

// 	function mintNFT(address to, uint256 tokenId, string calldata initialURI) public onlyRole(MANAGER_ROLE) {
// 		_mint(to, tokenId);
// 		_setTokenURI(tokenId, initialURI); // Définit l'URI initial
// 		metadataURIs[tokenId] = initialURI;
// 	}

// 	function updateMetadata(uint256 tokenId, string calldata newMetadataURI) external onlyRole(MANAGER_ROLE) {
// 		// require(_tokenExists(tokenId), 'NFT does not exist'); TODO a faire
// 		metadataURIs[tokenId] = newMetadataURI;
// 		_setTokenURI(tokenId, newMetadataURI);
// 		emit MetadataUpdated(tokenId, newMetadataURI);
// 	}

// 	function getMetadataURI(uint256 tokenId) external view returns (string memory) {
// 		return metadataURIs[tokenId];
// 	}

// 	// ////////////////////////////////////////////////////////////////////
// 	// MODULE ROLES
// 	// ////////////////////////////////////////////////////////////////////

// 	// Assigner un rôle pour un module spécifique sur un token
// 	function assignModuleRole(
// 		uint256 tokenId,
// 		string calldata moduleName,
// 		address authorizedAddress
// 	) external onlyRole(MANAGER_ROLE) {
// 		require(authorizedAddress != address(0), 'Invalid authorized address');
// 		tokenModuleRoles[tokenId][moduleName] = authorizedAddress;
// 		emit ModuleRoleAssigned(tokenId, moduleName, authorizedAddress);
// 	}

// 	// Récupérer l'adresse autorisée pour un module et un token
// 	function getModuleRole(uint256 tokenId, string calldata moduleName) external view returns (address) {
// 		return tokenModuleRoles[tokenId][moduleName];
// 	}

// 	// ////////////////////////////////////////////////////////////////////
// 	// MODULE MANAGER
// 	// ////////////////////////////////////////////////////////////////////

// 	function updateModuleManager(address _newManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
// 		require(_newManager != address(0), 'Invalid module manager address');
// 		moduleManager = _newManager;
// 		emit ModuleManagerUpdated(moduleManager, _newManager);
// 	}

// 	// ////////////////////////////////////////////////////////////////////
// 	// MODULE
// 	// ////////////////////////////////////////////////////////////////////

// 	function executeModule(string calldata moduleName, uint256 tokenId, string calldata fnName, bytes calldata data) public {
// 		// TODO verifier que moduleManager existe

// 		// Vérifiez que moduleManager est configuré
// 		require(moduleManager != address(0), 'ModuleManager not set');

// 		// Récupérez l'adresse autorisée pour ce module et ce token
// 		address authorizedAddress = tokenModuleRoles[tokenId][moduleName];
// 		require(authorizedAddress == msg.sender, 'Unauthorized for this module and token');

// 		// Récupérez l'adresse du module via IModuleRegistry
// 		address module = IModuleRegistry(moduleManager).getModule(moduleName);
// 		require(module != address(0), 'Module not found');

// 		// Appeler la fonction `execute` avec `fnName` et les autres paramètres
// 		IModule(module).execute(tokenId, fnName, data);
// 	}

// 	// ////////////////////////////////////////////////////////////////////
// 	// conflit
// 	// ////////////////////////////////////////////////////////////////////

// 	// Résolution du conflit pour supportsInterface
// 	function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
// 		return super.supportsInterface(interfaceId);
// 	}
// }
