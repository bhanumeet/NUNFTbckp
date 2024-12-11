//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HuskyCollection is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    constructor(
        address initialOwner
    ) ERC721("Husky Collection", "HSKY") Ownable(initialOwner) {}

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Creates a new token and mints it to the caller (allows only owner) with the given metadata URI.
     * @param metadataURI The URI of the metadata for the token.
     * @return The ID of the newly created token.
     */
    function createToken(
        string memory metadataURI
    ) public onlyOwner returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, metadataURI);

        return newTokenId;
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Retrieves an array of token IDs owned by a specific address.
     * @param owner The address for which to retrieve the owned token IDs.
     * @return An array containing the token IDs owned by the specified address.
     */
    function getTokensOwned(
        address owner
    ) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory tokenIds = new uint256[](tokenCount);

            for (uint256 i = 0; i < tokenCount; i++) {
                tokenIds[i] = tokenOfOwnerByIndex(owner, i);
            }

            return tokenIds;
        }
    }
}
