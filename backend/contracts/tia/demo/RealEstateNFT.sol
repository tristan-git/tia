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

contract RealEstateNFT is ERC721URIStorage, AccessControl {
	// TODO licence des contrats
	// TODO ajouter une constante initialiser dans constructeur pour le code RNB
	// TODO modifier les nom de varaible des address en to ou from ?
	// TODO hash dans bytes et pas string
	// TODO verifier les import inutile dans les contrat
	// TODO interface IModuleRegistry et IModule dans dautre fichier ?
	// TODO renomer MANAGER_ROLE plus explicite c'est le propietaire du bien / ou celui qui l'administire

	// Rôle pour gérer les fonctionnalités de manager
	bytes32 public constant MANAGER_ROLE = keccak256('MANAGER_ROLE');

	// Mapping des modules par leur nom
	mapping(string => address) private modules;

	// Structure pour gérer les autorisations spécifiques par module et token
	struct ModuleAccess {
		bool isAuthorized; // Indique si l'adresse est autorisée
		uint256 accessLevel; // Niveau d'accès : 1 (lecture), 2 (écriture)
	}

	// Mapping des autorisations : tokenId -> moduleName -> authorizedAddress -> ModuleAccess
	mapping(uint256 => mapping(string => mapping(address => ModuleAccess))) private tokenModuleRoles; // TODO nommer en tokenModuleWriteAccess

	// Événements
	event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);
	event ModuleRoleAssigned(
		uint256 indexed tokenId,
		string indexed moduleName,
		address indexed authorizedAddress,
		uint256 accessLevel
	);
	event ModuleRoleRevoked(uint256 indexed tokenId, string indexed moduleName, address indexed authorizedAddress);
	event ModuleRegistered(string indexed name, address indexed moduleAddress);
	event ModuleUpdated(string indexed name, address indexed oldAddress, address indexed newAddress);

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

	function registerModule(string calldata name, address moduleAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
		require(moduleAddress != address(0), 'Invalid module address');
		require(modules[name] == address(0), 'Module already exists');

		modules[name] = moduleAddress;
		emit ModuleRegistered(name, moduleAddress);
	}

	function updateModule(string calldata name, address newModuleAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
		require(newModuleAddress != address(0), 'Invalid module address');
		require(modules[name] != address(0), 'Module not found');

		address oldAddress = modules[name];
		modules[name] = newModuleAddress;
		emit ModuleUpdated(name, oldAddress, newModuleAddress);
	}

	function getModule(string calldata name) external view returns (address) {
		return modules[name];
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
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
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
	) external onlyRole(DEFAULT_ADMIN_ROLE) {
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

		ModuleAccess memory access = tokenModuleRoles[tokenId][moduleName][msg.sender];
		require(access.isAuthorized && access.accessLevel == 2, 'Not authorized for this module and token');

		IModule(modules[moduleName]).execute(tokenId, fnName, data, msg.sender);
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
