// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MyNFTWithRoles is ERC721, Ownable {
	mapping(uint256 => string) private _tokenURIs;
	mapping(uint256 => mapping(address => uint8)) private _roles; // tokenId -> (address -> role)

	// Enumération des rôles
	enum Role {
		NONE,
		OWNER,
		MANAGER,
		INTERVENANT
	}

	// Constructeur avec les arguments pour ERC721
	constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(msg.sender) {}

	function mintNFT(address recipient, uint256 tokenId, string memory newTokenURI) public onlyOwner {
		_mint(recipient, tokenId);
		_setTokenURI(tokenId, newTokenURI); // Utilisation de newTokenURI pour éviter le shadowing
		_roles[tokenId][recipient] = uint8(Role.OWNER); // Le créateur devient le propriétaire
	}

	function _setTokenURI(uint256 tokenId, string memory newTokenURI) internal {
		require(_tokenExists(tokenId), 'ERC721Metadata: URI set of nonexistent token');
		_tokenURIs[tokenId] = newTokenURI;
	}

	function tokenURI(uint256 tokenId) public view override returns (string memory) {
		require(_tokenExists(tokenId), 'ERC721Metadata: URI query for nonexistent token');
		return _tokenURIs[tokenId];
	}

	// Fonction pour vérifier si un token existe
	function _tokenExists(uint256 tokenId) internal view returns (bool) {
		try this.ownerOf(tokenId) {
			return true;
		} catch {
			return false;
		}
	}

	// Fonction pour attribuer un rôle à un utilisateur
	function assignRole(uint256 tokenId, address user, uint8 role) public {
		require(_tokenExists(tokenId), 'Token does not exist');
		require(ownerOf(tokenId) == msg.sender, 'Only the owner can assign roles');
		require(role > uint8(Role.OWNER) && role <= uint8(Role.INTERVENANT), 'Invalid role');
		require(user != msg.sender, 'Owner cannot change their own role');
		_roles[tokenId][user] = role;
	}

	// Fonction pour obtenir le rôle d'un utilisateur
	function getRole(uint256 tokenId, address user) public view returns (uint8) {
		require(_tokenExists(tokenId), 'Token does not exist');
		return _roles[tokenId][user];
	}

	// Fonction pour vérifier si un utilisateur a un rôle spécifique
	function hasRole(uint256 tokenId, address user, uint8 role) public view returns (bool) {
		require(_tokenExists(tokenId), 'Token does not exist');
		return _roles[tokenId][user] == role;
	}
}
