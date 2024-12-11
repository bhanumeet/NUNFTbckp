// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract NFTMarketplace {
    struct Listing {
        address seller;
        uint256 price;
    }

    struct TokenInfo {
        uint256 tokenId;
        uint256 price;
        string tokenURI;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => uint256[]) private ownedTokens;

    /**
     * @dev List an NFT for sale on the marketplace.
     * @param NFTCollectionContract The address of the NFT collection contract.
     * @param tokenId The ID of the NFT to be listed for sale.
     * @param price The price at which the NFT is listed for sale.
     */
    function listNFT(
        address NFTCollectionContract,
        uint256 tokenId,
        uint256 price
    ) public {
        IERC721(NFTCollectionContract).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );
        listings[NFTCollectionContract][tokenId] = Listing(msg.sender, price);
        ownedTokens[NFTCollectionContract].push(tokenId);
    }

    /**
     * @dev Allows a user to buy an NFT listed on the marketplace.
     * @param NFTCollectionContract The address of the NFT collection contract.
     * @param tokenId The ID of the NFT to be purchased.
     *  payable The amount of Ether sent to complete the purchase.
     * Requirements:
     * - The buyer must send an amount of Ether greater than or equal to the listing price.
     * Effects:
     * - Transfers the NFT from the marketplace contract to the buyer.
     * - Transfers the payment to the seller.
     * - Removes the listing of the NFT from the marketplace.
     * - Removes the token from the ownedTokens array of the seller.
     */
    function buyNFT(
        address NFTCollectionContract,
        uint256 tokenId
    ) public payable {
        Listing memory listing = listings[NFTCollectionContract][tokenId];
        require(msg.value >= listing.price, "Insufficient payment");

        delete listings[NFTCollectionContract][tokenId];
        IERC721(NFTCollectionContract).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );
        payable(listing.seller).transfer(msg.value);

        for (
            uint256 i = 0;
            i < ownedTokens[NFTCollectionContract].length;
            i++
        ) {
            if (ownedTokens[NFTCollectionContract][i] == tokenId) {
                ownedTokens[NFTCollectionContract][i] = ownedTokens[
                    NFTCollectionContract
                ][ownedTokens[NFTCollectionContract].length - 1];
                ownedTokens[NFTCollectionContract].pop();
                break;
            }
        }
    }

    /**
     * @dev Retrieves information about the NFTs owned by a user in the marketplace.
     * @param NFTCollectionContract The address of the NFT collection contract.
     * @return TokenInfo[] An array of TokenInfo structs containing information about the owned NFTs.
     * - tokenId The ID of the owned NFT.
     * - price The price at which the NFT is listed for sale.
     * - tokenURI The URI of the NFT's metadata.
     */

    function getOwnedNFTs(
        address NFTCollectionContract
    ) public view returns (TokenInfo[] memory) {
        uint256[] memory tokenIds = ownedTokens[NFTCollectionContract];
        TokenInfo[] memory tokenInfos = new TokenInfo[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            uint256 price = listings[NFTCollectionContract][tokenId].price;
            string memory tokenURI = IERC721Metadata(NFTCollectionContract)
                .tokenURI(tokenId);
            tokenInfos[i] = TokenInfo(tokenId, price, tokenURI);
        }

        return tokenInfos;
    }
}
