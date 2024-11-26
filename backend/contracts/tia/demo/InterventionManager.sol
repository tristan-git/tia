// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract InterventionManager {
	address private realEstateNFT;

	struct Document {
		string name;
		string url;
		string hash; // SHA256 hash pour valider l'intégrité
		bool restricted; // Indique si le document est restreint
	}

	struct Intervention {
		string details;
		address provider;
		uint256 timestamp;
		Document[] documents; // Liste des documents associés
	}

	mapping(uint256 => mapping(address => Intervention[])) private interventions; // Interventions par tokenId -> address -> [interventions]

	event InterventionAdded(uint256 indexed tokenId, string details, address provider, uint256 timestamp);
	event DocumentAdded(uint256 indexed tokenId, uint256 interventionIndex, string name, string url);

	constructor(address _realEstateNFT) {
		require(_realEstateNFT != address(0), 'Invalid RealEstateNFT address');
		realEstateNFT = _realEstateNFT;
	}

	// Choisir une fonction à exécuter en fonction de fnName
	function execute(uint256 tokenId, string calldata fnName, bytes calldata data, address user) external {
		// Vérifie que seul le RealEstateNFT peut appeler cette fonction
		require(msg.sender == realEstateNFT, 'Unauthorized caller');

		if (Strings.equal(fnName, 'addIntervention')) {
			_addIntervention(tokenId, user, data);
		} else if (Strings.equal(fnName, 'addDocument')) {
			_addDocument(tokenId, user, data);
		} else {
			revert('Invalid function name');
		}
	}

	// Ajouter une intervention
	function _addIntervention(uint256 tokenId, address user, bytes calldata data) internal {
		(string memory details, address provider) = abi.decode(data, (string, address));

		interventions[tokenId][user].push();
		uint256 newIndex = interventions[tokenId][user].length - 1;
		interventions[tokenId][user][newIndex].details = details;
		interventions[tokenId][user][newIndex].provider = provider;
		interventions[tokenId][user][newIndex].timestamp = block.timestamp;

		emit InterventionAdded(tokenId, details, provider, block.timestamp);
	}

	// Ajouter un document à une intervention spécifique
	function _addDocument(uint256 tokenId, address user, bytes calldata data) internal {
		(uint256 interventionIndex, string memory name, string memory url, string memory hash, bool restricted) = abi.decode(
			data,
			(uint256, string, string, string, bool)
		);

		require(interventionIndex < interventions[tokenId][user].length, 'Invalid intervention index');

		interventions[tokenId][user][interventionIndex].documents.push(
			Document({name: name, url: url, hash: hash, restricted: restricted})
		);

		emit DocumentAdded(tokenId, interventionIndex, name, url);
	}

	// TODO bytes32 pour les hash !!!!!

	// Récupérer les interventions associées à un tokenId
	function getInterventions(uint256 tokenId, address user) external view returns (Intervention[] memory) {
		return interventions[tokenId][user];
	}

	// Récupérer les documents d'une intervention
	function getDocuments(uint256 tokenId, uint256 interventionIndex, address user) external view returns (Document[] memory) {
		require(interventionIndex < interventions[tokenId][user].length, 'Invalid intervention index');
		return interventions[tokenId][user][interventionIndex].documents;
	}
}

// pragma solidity 0.8.28;

// import 'hardhat/console.sol';
// import '@openzeppelin/contracts/utils/Strings.sol';

// contract InterventionManager {
// 	address private realEstateNFT;

// 	struct Document {
// 		string name;
// 		string url;
// 		string hash; // SHA256 hash pour valider l'intégrité
// 		bool restricted; // Indique si le document est restreint
// 	}

// 	struct Intervention {
// 		string details;
// 		address provider;
// 		uint256 timestamp;
// 		Document[] documents; // Liste des documents associés
// 	}

// 	mapping(uint256 => Intervention[]) private interventions; // Interventions par tokenId

// 	event InterventionAdded(uint256 indexed tokenId, string details, address provider, uint256 timestamp);
// 	event DocumentAdded(uint256 indexed tokenId, uint256 interventionIndex, string name, string url);

// 	constructor(address _realEstateNFT) {
// 		require(_realEstateNFT != address(0), 'Invalid RealEstateNFT address');
// 		realEstateNFT = _realEstateNFT;
// 	}

// 	// Choisir une fonction à exécuter en fonction de fnName
// 	function execute(uint256 tokenId, string calldata fnName, bytes calldata data) external {
// 		// Vérifie que seul le RealEstateNFT peut appeler cette fonction
// 		require(msg.sender == realEstateNFT, 'Unauthorized caller');

// 		if (Strings.equal(fnName, 'addIntervention')) {
// 			_addIntervention(tokenId, data);
// 		} else if (Strings.equal(fnName, 'addDocument')) {
// 			_addDocument(tokenId, data);
// 		} else {
// 			revert('Invalid function name');
// 		}
// 	}

// 	// Ajouter une intervention
// 	function _addIntervention(uint256 tokenId, bytes calldata data) internal {
// 		(string memory details, address provider) = abi.decode(data, (string, address));

// 		interventions[tokenId].push();
// 		uint256 newIndex = interventions[tokenId].length - 1;
// 		interventions[tokenId][newIndex].details = details;
// 		interventions[tokenId][newIndex].provider = provider;
// 		interventions[tokenId][newIndex].timestamp = block.timestamp;

// 		emit InterventionAdded(tokenId, details, provider, block.timestamp);
// 	}

// 	// Ajouter un document à une intervention spécifique
// 	function _addDocument(uint256 tokenId, bytes calldata data) internal {
// 		(uint256 interventionIndex, string memory name, string memory url, string memory hash, bool restricted) = abi.decode(
// 			data,
// 			(uint256, string, string, string, bool)
// 		);

// 		require(interventionIndex < interventions[tokenId].length, 'Invalid intervention index');

// 		interventions[tokenId][interventionIndex].documents.push(
// 			Document({name: name, url: url, hash: hash, restricted: restricted})
// 		);

// 		emit DocumentAdded(tokenId, interventionIndex, name, url);
// 	}

// 	// TODO bytes32 pour les hash !!!!!

// 	// Récupérer les interventions associées à un tokenId
// 	function getInterventions(uint256 tokenId) external view returns (Intervention[] memory) {
// 		return interventions[tokenId];
// 	}

// 	// Récupérer les documents d'une intervention
// 	function getDocuments(uint256 tokenId, uint256 interventionIndex) external view returns (Document[] memory) {
// 		require(interventionIndex < interventions[tokenId].length, 'Invalid intervention index');
// 		return interventions[tokenId][interventionIndex].documents;
// 	}
// }
