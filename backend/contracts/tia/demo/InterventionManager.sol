// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/access/IAccessControl.sol';

contract InterventionManager {
	// TODO realEstateNFT renommer en plus parlant
	// TODO isValidate by onwer ?? le propreaitire valide que interventiona bien eu lieu
	// TODO address from from c'est parlant ??

	address private realEstateNFT;
	bytes32 public constant MANAGER_ROLE = keccak256('MANAGER_ROLE');

	struct Document {
		bytes32 documentHash;
	}

	struct Intervention {
		bytes32 interventionHash;
		Document[] documents;
		bool isValidatedByOwner; // Indique si le propriétaire a validé l'intervention
	}

	mapping(uint256 => mapping(address => Intervention[])) private interventions; // Interventions par tokenId -> address -> [interventions]

	// Mapping pour stocker les permissions (tokenId -> indexIntervention -> user -> isAuthorized)
	mapping(uint256 => mapping(uint256 => mapping(address => bool))) private permissions;

	event InterventionAdded(uint256 indexed tokenId, bytes32 interventionHash, uint256 timestamp, address from);
	event DocumentAdded(uint256 indexed tokenId, uint256 interventionIndex, bytes32 documentHash, address from);
	event InterventionValidated(uint256 indexed tokenId, uint256 interventionIndex, address owner);

	event AccessGranted(uint256 indexed tokenId, uint256 indexed interventionIndex, address indexed user);
	event AccessRevoked(uint256 indexed tokenId, uint256 indexed interventionIndex, address indexed user);

	constructor(address _realEstateNFT) {
		require(_realEstateNFT != address(0), 'Invalid RealEstateNFT address');
		realEstateNFT = _realEstateNFT;
	}

	// ////////////////////////////////////////////////////////////////////
	// EXECUTE
	// ////////////////////////////////////////////////////////////////////

	// Choisir une fonction à exécuter en fonction de fnName
	function execute(uint256 tokenId, string calldata fnName, bytes calldata data, address user) external {
		// Vérifie que seul le RealEstateNFT peut appeler cette fonction
		require(msg.sender == realEstateNFT, 'Unauthorized caller');

		if (Strings.equal(fnName, 'addIntervention')) {
			_addIntervention(tokenId, user, data);
		} else if (Strings.equal(fnName, 'addDocument')) {
			_addDocument(tokenId, user, data);
		} else if (Strings.equal(fnName, 'validateIntervention')) {
			_validateIntervention(tokenId, user, data);
		} else {
			revert('Invalid function name');
		}
	}

	// ////////////////////////////////////////////////////////////////////
	// EXECUTE FUNCTION
	// ////////////////////////////////////////////////////////////////////

	// Ajouter une intervention
	function _addIntervention(uint256 _tokenId, address _from, bytes calldata _data) internal {
		bytes32 _interventionHash = abi.decode(_data, (bytes32));

		interventions[_tokenId][_from].push();
		uint256 newIndex = interventions[_tokenId][_from].length - 1;
		interventions[_tokenId][_from][newIndex].interventionHash = _interventionHash;

		emit InterventionAdded(_tokenId, _interventionHash, block.timestamp, _from);
	}

	// Ajouter un document à une intervention spécifique
	function _addDocument(uint256 _tokenId, address _from, bytes calldata _data) internal {
		(uint256 _interventionIndex, bytes32 _documentHash) = abi.decode(_data, (uint256, bytes32));

		require(_interventionIndex < interventions[_tokenId][_from].length, 'Invalid intervention index');
		require(!interventions[_tokenId][_from][_interventionIndex].isValidatedByOwner, 'Intervention already validated');

		interventions[_tokenId][_from][_interventionIndex].documents.push(Document({documentHash: _documentHash}));

		emit DocumentAdded(_tokenId, _interventionIndex, _documentHash, _from);
	}

	// Valider une intervention par le propriétaire
	function _validateIntervention(uint256 _tokenId, address _from, bytes calldata _data) internal {
		// Vérifie si l'utilisateur a MANAGER_ROLE dans RealEstateNFT
		require(IAccessControl(realEstateNFT).hasRole(MANAGER_ROLE, _from), 'Only a manager can validate');

		uint256 _interventionIndex = abi.decode(_data, (uint256));

		require(_interventionIndex < interventions[_tokenId][_from].length, 'Invalid intervention index');
		require(interventions[_tokenId][_from][_interventionIndex].isValidatedByOwner == false, 'Already validated');

		interventions[_tokenId][_from][_interventionIndex].isValidatedByOwner = true;

		emit InterventionValidated(_tokenId, _interventionIndex, _from);
	}

	// ////////////////////////////////////////////////////////////////////
	// GET FUNCTION
	// ////////////////////////////////////////////////////////////////////

	// Récupérer les interventions associées à un tokenId
	function getInterventions(uint256 tokenId, address user) external view returns (Intervention[] memory) {
		return interventions[tokenId][user];
	}

	// Récupérer les documents d'une intervention
	function getDocuments(uint256 tokenId, uint256 interventionIndex, address user) external view returns (Document[] memory) {
		require(interventionIndex < interventions[tokenId][user].length, 'Invalid intervention index');
		return interventions[tokenId][user][interventionIndex].documents;
	}

	// ////////////////////////////////////////////////////////////////////
	// PERMISSIONS MANAGEMENT
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Attribue l'accès à une intervention spécifique pour un utilisateur.
	 * @param tokenId ID du token immobilier concerné.
	 * @param _interventionIndex Index de l'intervention à laquelle l'accès est accordé.
	 * @param user Adresse de l'utilisateur à qui l'accès est attribué.
	 */
	function grantAccess(uint256 tokenId, uint256 _interventionIndex, address user) external {
		// Vérifie que seul le MANAGER_ROLE peut attribuer des permissions
		require(IAccessControl(realEstateNFT).hasRole(MANAGER_ROLE, msg.sender), 'Only managers can grant access');

		permissions[tokenId][_interventionIndex][user] = true;

		emit AccessGranted(tokenId, _interventionIndex, user);
	}

	/**
	 * @dev Révoque l'accès à une intervention spécifique pour un utilisateur.
	 * @param tokenId ID du token immobilier concerné.
	 * @param _interventionIndex Index de l'intervention pour laquelle l'accès est révoqué.
	 * @param user Adresse de l'utilisateur dont l'accès est révoqué.
	 */
	function revokeAccess(uint256 tokenId, uint256 _interventionIndex, address user) external {
		// Vérifie que seul le MANAGER_ROLE peut révoquer des permissions
		require(IAccessControl(realEstateNFT).hasRole(MANAGER_ROLE, msg.sender), 'Only managers can revoke access');

		permissions[tokenId][_interventionIndex][user] = false;

		emit AccessRevoked(tokenId, _interventionIndex, user);
	}

	/**
	 * @dev Vérifie si un utilisateur est autorisé à accéder à une intervention spécifique.
	 * @param tokenId ID du token immobilier concerné.
	 * @param _interventionIndex Index de l'intervention à vérifier.
	 * @param user Adresse de l'utilisateur dont l'autorisation est vérifiée.
	 * @return bool Indique si l'utilisateur est autorisé ou non.
	 */
	function isAuthorized(uint256 tokenId, uint256 _interventionIndex, address user) public view returns (bool) {
		return permissions[tokenId][_interventionIndex][user];
	}
}
