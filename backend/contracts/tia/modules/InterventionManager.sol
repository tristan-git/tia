// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/access/IAccessControl.sol';

contract InterventionManager {
	address private immutable estateManagerContract;
	bytes32 public constant ESTATE_MANAGER_ROLE = keccak256('ESTATE_MANAGER_ROLE');

	struct Document {
		bytes32 documentHash;
	}

	struct Intervention {
		bytes32 interventionHash;
		Document[] documents;
		bool isValidated;
	}

	mapping(uint256 => mapping(address => Intervention[])) private interventions; // Interventions par tokenId -> address -> [interventions]

	// Mapping pour contrôler l'accès (tokenId -> interventionIndex -> _account -> isAuthorized)
	mapping(uint256 => mapping(uint256 => mapping(address => bool))) private interventionAccess;

	event InterventionManagerInitialized(address indexed estateManagerContract, uint256 timestamp);
	event InterventionAdded(uint256 indexed tokenId, bytes32 interventionHash, uint256 timestamp, address from);
	event DocumentAdded(uint256 indexed tokenId, uint256 interventionIndex, bytes32 documentHash, address from);
	event InterventionValidated(uint256 indexed tokenId, uint256 interventionIndex, address owner);
	event InterventionAccessChanged(
		uint256 indexed tokenId,
		uint256 indexed interventionIndex,
		address indexed account,
		address from,
		bool granted
	);

	constructor(address _realEstateNFTContract) {
		require(_realEstateNFTContract != address(0), 'Invalid estateManagerContract address');
		estateManagerContract = _realEstateNFTContract;

		emit InterventionManagerInitialized(_realEstateNFTContract, block.timestamp);
	}

	// ////////////////////////////////////////////////////////////////////
	// EXECUTE
	// ////////////////////////////////////////////////////////////////////

	// Choisir une fonction à exécuter en fonction de fnName
	function execute(uint256 _tokenId, string calldata _fnName, bytes calldata _data, address _from) external {
		require(msg.sender == estateManagerContract, 'Unauthorized caller');

		if (Strings.equal(_fnName, 'addIntervention')) {
			_addIntervention(_tokenId, _from, _data);
		} else if (Strings.equal(_fnName, 'addDocument')) {
			_addDocument(_tokenId, _from, _data);
		} else if (Strings.equal(_fnName, 'validateIntervention')) {
			_validateIntervention(_tokenId, _from, _data);
		} else if (Strings.equal(_fnName, 'grantInterventionAccess')) {
			_grantInterventionAccess(_tokenId, _from, _data);
		} else if (Strings.equal(_fnName, 'revokeInterventionAccess')) {
			_revokeInterventionAccess(_tokenId, _from, _data);
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

		require(_interventionHash != bytes32(0), "Hash d'intervention invalide");

		interventions[_tokenId][_from].push();
		uint256 newIndex = interventions[_tokenId][_from].length - 1;
		interventions[_tokenId][_from][newIndex].interventionHash = _interventionHash;

		emit InterventionAdded(_tokenId, _interventionHash, block.timestamp, _from);
	}

	// Ajouter un document à une intervention spécifique
	function _addDocument(uint256 _tokenId, address _from, bytes calldata _data) internal {
		(uint256 _interventionIndex, bytes32 _documentHash) = abi.decode(_data, (uint256, bytes32));

		require(_documentHash != bytes32(0), 'Hash document invalide');

		require(_interventionIndex < interventions[_tokenId][_from].length, 'Invalid intervention index');
		require(!interventions[_tokenId][_from][_interventionIndex].isValidated, 'Intervention already validated');

		interventions[_tokenId][_from][_interventionIndex].documents.push(Document({documentHash: _documentHash}));

		emit DocumentAdded(_tokenId, _interventionIndex, _documentHash, _from);
	}

	// Valider une intervention par le propriétaire
	function _validateIntervention(uint256 _tokenId, address _from, bytes calldata _data) internal {
		// Vérifie si l'utilisateur a MANAGER_ROLE dans estateManagerContract
		require(IAccessControl(estateManagerContract).hasRole(ESTATE_MANAGER_ROLE, _from), 'Only a manager can validate');

		uint256 _interventionIndex = abi.decode(_data, (uint256));

		require(_interventionIndex < interventions[_tokenId][_from].length, 'Invalid intervention index');
		require(interventions[_tokenId][_from][_interventionIndex].isValidated == false, 'Already validated');

		interventions[_tokenId][_from][_interventionIndex].isValidated = true;

		emit InterventionValidated(_tokenId, _interventionIndex, _from);
	}

	function _grantInterventionAccess(uint256 _tokenId, address _from, bytes calldata _data) internal {
		(uint256 _interventionIndex, address _account) = abi.decode(_data, (uint256, address));

		require(IAccessControl(estateManagerContract).hasRole(ESTATE_MANAGER_ROLE, _from), 'Only a manager can validate');

		interventionAccess[_tokenId][_interventionIndex][_account] = true;

		emit InterventionAccessChanged(_tokenId, _interventionIndex, _account, _from, true);
	}

	function _revokeInterventionAccess(uint256 _tokenId, address _from, bytes calldata _data) internal {
		(uint256 _interventionIndex, address _account) = abi.decode(_data, (uint256, address));

		require(IAccessControl(estateManagerContract).hasRole(ESTATE_MANAGER_ROLE, _from), 'Only a manager can validate');

		interventionAccess[_tokenId][_interventionIndex][_account] = false;

		emit InterventionAccessChanged(_tokenId, _interventionIndex, _account, _from, false);
	}

	// ////////////////////////////////////////////////////////////////////
	// GET FUNCTION
	// ////////////////////////////////////////////////////////////////////

	// Récupérer les interventions associées à un tokenId
	function getInterventions(uint256 _tokenId, address _account) external view returns (Intervention[] memory) {
		return interventions[_tokenId][_account];
	}

	// Récupérer les documents d'une intervention
	function getDocuments(
		uint256 _tokenId,
		uint256 _interventionIndex,
		address _account
	) external view returns (Document[] memory) {
		require(_interventionIndex < interventions[_tokenId][_account].length, 'Invalid intervention index');
		return interventions[_tokenId][_account][_interventionIndex].documents;
	}

	function hasInterventionAccess(uint256 _tokenId, uint256 _interventionIndex, address _account) public view returns (bool) {
		return interventionAccess[_tokenId][_interventionIndex][_account];
	}
}
