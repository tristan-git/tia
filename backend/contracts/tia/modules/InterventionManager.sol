// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/access/IAccessControl.sol';

contract InterventionManager {
	address private immutable estateManagerContract;
	address private immutable manager;
	bytes32 public constant ESTATE_MANAGER_ROLE = keccak256('ESTATE_MANAGER_ROLE');

	struct Document {
		string title;
		bytes32 documentHash;
	}

	struct Intervention {
		string title;
		Document[] documents;
		bool isValidated;
	}

	// Mapping: tokenId -> user address -> array of interventions
	mapping(uint256 => mapping(address => Intervention[])) private interventions;

	// Access control mapping: tokenId -> interventionIndex -> account -> isAuthorized
	mapping(uint256 => mapping(uint256 => mapping(address => bool))) private interventionAccess;

	event InterventionManagerInitialized(address indexed estateManagerContract, address indexed from, uint256 timestamp);
	event InterventionAdded(uint256 indexed tokenId, string title, uint256 timestamp, address from, uint256 interventionIndex);
	event DocumentAdded(uint256 indexed tokenId, uint256 interventionIndex, bytes32 documentHash, string title, address from);
	event InterventionValidated(uint256 indexed tokenId, uint256 interventionIndex, address from);
	event InterventionAccessChanged(
		uint256 indexed tokenId,
		uint256 indexed interventionIndex,
		address indexed account,
		address from,
		bool granted
	);

	constructor(address _realEstateNFTContract, address _manager) {
		require(_realEstateNFTContract != address(0), 'Invalid estateManagerContract address');
		require(_manager != address(0), 'Invalid manager address');
		estateManagerContract = _realEstateNFTContract;
		manager = _manager;

		emit InterventionManagerInitialized(_realEstateNFTContract, msg.sender, block.timestamp);
	}

	// ////////////////////////////////////////////////////////////////////
	// EXECUTE
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Executes the specified function based on its name and input data.
	 * @param _tokenId The ID of the token associated with the intervention.
	 * @param _fnName The name of the function to execute.
	 * @param _data Encoded function parameters.
	 * @param _from Address of the caller.
	 */
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

	/**
	 * @dev Adds a new intervention to the specified token and address.
	 * @param _tokenId The ID of the token.
	 * @param _from The address initiating the addition.
	 * @param _data Encoded data containing the title of the intervention.
	 */
	function _addIntervention(uint256 _tokenId, address _from, bytes calldata _data) internal {
		string memory _title = abi.decode(_data, (string));

		interventions[_tokenId][_from].push();
		uint256 newIndex = interventions[_tokenId][_from].length - 1;
		interventions[_tokenId][_from][newIndex].title = _title;

		emit InterventionAdded(_tokenId, _title, block.timestamp, _from, newIndex);
	}

	/**
	 * @dev Adds a document to an existing intervention.
	 * @param _tokenId The ID of the token.
	 * @param _from The address initiating the addition.
	 * @param _data Encoded data containing the intervention index, document title, and hash.
	 */
	function _addDocument(uint256 _tokenId, address _from, bytes calldata _data) internal {
		(uint256 _interventionIndex, string memory _title, bytes32 _documentHash) = abi.decode(_data, (uint256, string, bytes32));

		require(_documentHash != bytes32(0), 'Hash document invalide');
		require(_interventionIndex < interventions[_tokenId][_from].length, 'Invalid intervention index');
		require(!interventions[_tokenId][_from][_interventionIndex].isValidated, 'Intervention already validated');

		interventions[_tokenId][_from][_interventionIndex].documents.push(Document({documentHash: _documentHash, title: _title}));

		interventionAccess[_tokenId][_interventionIndex][_from] = true;
		interventionAccess[_tokenId][_interventionIndex][manager] = true;

		emit InterventionAccessChanged(_tokenId, _interventionIndex, _from, _from, true);
		emit InterventionAccessChanged(_tokenId, _interventionIndex, manager, _from, true);
		emit DocumentAdded(_tokenId, _interventionIndex, _documentHash, _title, _from);
	}

	/**
	 * @dev Validates an intervention for a given token and creator.
	 * @param _tokenId The ID of the token.
	 * @param _from The address of the manager initiating the validation.
	 * @param _data Encoded data containing the intervention index and creator's address.
	 */
	function _validateIntervention(uint256 _tokenId, address _from, bytes calldata _data) internal {
		require(IAccessControl(estateManagerContract).hasRole(ESTATE_MANAGER_ROLE, _from), 'Only a manager can validate');

		(uint256 _interventionIndex, address _createdBy) = abi.decode(_data, (uint256, address));

		require(_interventionIndex < interventions[_tokenId][_createdBy].length, 'Invalid intervention index');
		require(interventions[_tokenId][_createdBy][_interventionIndex].isValidated == false, 'Already validated');

		interventions[_tokenId][_createdBy][_interventionIndex].isValidated = true;

		emit InterventionValidated(_tokenId, _interventionIndex, _from);
	}

	/**
	 * @dev Grants access to a specific intervention for a given account.
	 * @param _tokenId The ID of the token.
	 * @param _from The address of the manager initiating the access grant.
	 * @param _data Encoded data containing the intervention index and the account to grant access to.
	 */
	function _grantInterventionAccess(uint256 _tokenId, address _from, bytes calldata _data) internal {
		(uint256 _interventionIndex, address _account) = abi.decode(_data, (uint256, address));

		require(IAccessControl(estateManagerContract).hasRole(ESTATE_MANAGER_ROLE, _from), 'Only a manager can validate');

		interventionAccess[_tokenId][_interventionIndex][_account] = true;

		emit InterventionAccessChanged(_tokenId, _interventionIndex, _account, _from, true);
	}

	/**
	 * @dev Revokes access to a specific intervention for a given account.
	 * @param _tokenId The ID of the token.
	 * @param _from The address of the manager initiating the access revocation.
	 * @param _data Encoded data containing the intervention index and the account to revoke access from.
	 */
	function _revokeInterventionAccess(uint256 _tokenId, address _from, bytes calldata _data) internal {
		(uint256 _interventionIndex, address _account) = abi.decode(_data, (uint256, address));

		require(IAccessControl(estateManagerContract).hasRole(ESTATE_MANAGER_ROLE, _from), 'Only a manager can validate');

		interventionAccess[_tokenId][_interventionIndex][_account] = false;

		emit InterventionAccessChanged(_tokenId, _interventionIndex, _account, _from, false);
	}

	// ////////////////////////////////////////////////////////////////////
	// GETTERS
	// ////////////////////////////////////////////////////////////////////

	/**
	 * @dev Retrieves all interventions associated with a token and user.
	 * @param _tokenId The ID of the token.
	 * @param _account The address of the user.
	 * @return An array of `Intervention` structs.
	 */
	function getInterventions(uint256 _tokenId, address _account) external view returns (Intervention[] memory) {
		return interventions[_tokenId][_account];
	}

	/**
	 * @dev Retrieves the documents for a specific intervention.
	 * @param _tokenId The ID of the token.
	 * @param _interventionIndex The index of the intervention.
	 * @param _account The address of the user.
	 * @return An array of `Document` structs.
	 */
	function getDocuments(
		uint256 _tokenId,
		uint256 _interventionIndex,
		address _account
	) external view returns (Document[] memory) {
		require(_interventionIndex < interventions[_tokenId][_account].length, 'Invalid intervention index');
		return interventions[_tokenId][_account][_interventionIndex].documents;
	}

	/**
	 * @dev Checks whether an address has access to a specific intervention.
	 * @param _tokenId The ID of the token.
	 * @param _interventionIndex The index of the intervention.
	 * @param _account The address to check.
	 * @return `true` if the account has access, otherwise `false`.
	 */
	function hasInterventionAccess(uint256 _tokenId, uint256 _interventionIndex, address _account) external view returns (bool) {
		return interventionAccess[_tokenId][_interventionIndex][_account];
	}
}
