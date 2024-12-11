import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styles from "./NFTGallery.module.css";
import NFTMarketplaceABI from "../abi/Marketplace.abi.json";

const NFTMarketplaceAddress = "0xB142ca65005610D3dA999313552BFCe13B320EA2";

const NFTGallery = () => {
  const [nftMarketplaceContract, setNFTMarketplaceContract] =
    useState<ethers.Contract | null>(null);
  const [nftCollectionAddress, setNFTCollectionAddress] = useState<string>("");
  const [ownedNFTs, setOwnedNFTs] = useState<
    { tokenId: number; price: number; tokenURI: string }[]
  >([]);
  const [price, setPrice] = useState(""); // Added state for price

  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          NFTMarketplaceAddress,
          NFTMarketplaceABI,
          signer
        );
        setNFTMarketplaceContract(contract);
      } else {
        console.error("MetaMask not installed; using read-only defaults");
      }
    };

    initializeContract();
  }, []);

  const fetchOwnedNFTs = async () => {
    if (nftMarketplaceContract && nftCollectionAddress) {
      const ownedTokenInfos = await nftMarketplaceContract.getOwnedNFTs(
        nftCollectionAddress
      );
      console.log("Owned NFTs:");
      console.log(ownedTokenInfos);

      const tokenDetails = await Promise.all(
        ownedTokenInfos.map(
          async (info: { tokenURI: string; tokenId: string; price: any }) => {
            const metadataUrl = info.tokenURI.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            );
            const metadata = await fetch(metadataUrl).then((res) => res.json());
            const imageUrl = metadata.image.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            );
            return {
              tokenId: info.tokenId.toString(), // Convert BigNumber to number
              price: info.price,
              tokenURI: imageUrl, // Use the image URL from the metadata
            };
          }
        )
      );
      setOwnedNFTs(tokenDetails);
    }
  };

  useEffect(() => {
    if (nftCollectionAddress) {
      fetchOwnedNFTs();
    }
  }, [nftMarketplaceContract, nftCollectionAddress]);

  const handleBuy = async (tokenId: number, price: string) => {
    if (!nftMarketplaceContract || !price) return;

    const transaction = await nftMarketplaceContract.buyNFT(
      nftCollectionAddress,
      tokenId,
      { value: ethers.parseEther(price) }
    );
    await transaction.wait();
    fetchOwnedNFTs(); // Refresh the owned NFTs list
  };

  return (
    <div className={styles.nftGallery}>
      <h1>NFT's Listed for Sale</h1>
      <input
        type="text"
        placeholder="Enter NFT Collection Address"
        value={nftCollectionAddress}
        onChange={(e) => setNFTCollectionAddress(e.target.value)}
      />
      <button onClick={fetchOwnedNFTs}>
        Fetch NFTS for sale from a collection
      </button>
      <div className={styles.nftGrid}>
        {ownedNFTs.map((nft) => (
          <div className={styles.nftItem} key={nft.tokenId}>
            <h3>Token ID: {nft.tokenId}</h3>
            <img src={nft.tokenURI} alt={`NFT ${nft.tokenId}`} />
            <p>Price: {ethers.formatEther(nft.price)} ETH</p>
            <input
              type="number"
              placeholder="Enter your price"
              onChange={(e) => setPrice(e.target.value)}
            />
            <button onClick={() => handleBuy(nft.tokenId, price)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTGallery;
