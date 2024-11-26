// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract BuildingManager is ERC721URIStorage, Ownable {
	struct MetadataEntry {
		string hash; // Hash des métadonnées
		address addedBy; // Adresse de l'utilisateur qui a ajouté cette entrée
	}

	mapping(uint256 => MetadataEntry[]) public buildingMetadata;

	struct Role {
		bool isOwner;
		bool isManager;
		bool isTenant;
		bool isIntervenant;
	}

	struct Building {
		uint256 id;
		address[] owners; // Liste des propriétaires
		mapping(address => uint256) ownershipShares; // Parts de chaque propriétaire
		address[] tenants; // Liste des locataires
		mapping(address => Role) roles; // Rôles par adresse
	}

	uint256 public buildingCount;
	mapping(uint256 => Building) public buildings;

	mapping(uint256 => string) public metadataHashes;

	event BuildingRegistered(uint256 buildingId, address[] owners, string metadataURI);
	event RoleAssigned(uint256 buildingId, address user, string role);

	constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(msg.sender) {}

	// Enregistrer un nouveau bâtiment et créer un NFT associé
	function registerBuilding(address[] memory owners, uint256[] memory shares, string memory metadataURI) public onlyOwner {
		require(owners.length == shares.length, 'Mismatched owners and shares');

		buildingCount++;
		Building storage building = buildings[buildingCount];
		building.id = buildingCount;

		for (uint256 i = 0; i < owners.length; i++) {
			building.owners.push(owners[i]);
			building.ownershipShares[owners[i]] = shares[i];
			building.roles[owners[i]].isOwner = true;
		}

		// Mint NFT pour représenter ce bâtiment
		_mint(msg.sender, buildingCount);
		_setTokenURI(buildingCount, metadataURI); // Fonction disponible grâce à ERC721URIStorage

		emit BuildingRegistered(buildingCount, owners, metadataURI);
	}

	// Assigner un rôle à un utilisateur
	function assignRole(uint256 buildingId, address user, string memory role) public {
		require(ownerOf(buildingId) == msg.sender, 'Only the NFT owner can assign roles');

		if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked('tenant'))) {
			buildings[buildingId].roles[user].isTenant = true;
		} else if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked('manager'))) {
			buildings[buildingId].roles[user].isManager = true;
		} else if (keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked('intervenant'))) {
			buildings[buildingId].roles[user].isIntervenant = true;
		} else {
			revert('Invalid role');
		}

		emit RoleAssigned(buildingId, user, role);
	}

	// Vérifier le rôle d'un utilisateur
	function getRoles(uint256 buildingId, address user) public view returns (Role memory) {
		return buildings[buildingId].roles[user];
	}

	// // Fonction pour vérifier si un utilisateur a un rôle spécifique
	// function hasRole(uint256 tokenId, address user, uint8 role) public view returns (bool) {
	// 	require(_tokenExists(tokenId), 'Token does not exist');
	// 	return _roles[tokenId][user] == role;
	// }

	function addDynamicMetadata(uint256 buildingId, string memory metadataHash) public {
		require(
			buildings[buildingId].roles[msg.sender].isOwner ||
				buildings[buildingId].roles[msg.sender].isManager ||
				buildings[buildingId].roles[msg.sender].isIntervenant,
			'Unauthorized to add metadata'
		);

		MetadataEntry memory newMetadata = MetadataEntry({hash: metadataHash, addedBy: msg.sender});

		buildingMetadata[buildingId].push(newMetadata);
	}

	function getMetadata(uint256 buildingId) public view returns (MetadataEntry[] memory) {
		return buildingMetadata[buildingId];
	}

	function verifyMetadata(uint256 tokenId, string memory metadataHash) public view returns (bool) {
		return keccak256(abi.encodePacked(metadataHashes[tokenId])) == keccak256(abi.encodePacked(metadataHash));
	}
}
