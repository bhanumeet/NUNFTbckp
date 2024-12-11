import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { INFT } from "../interfaces/INFT";

import TokenABI from "../abi/Token.abi.json";
import MarketplaceABI from "../abi/Marketplace.abi.json";
const COLLECTION_CONTRACT_ADDRESS =
  "0x53a70FFd8A76Bb50Dc018AdF84a6A96D3Da54Cb2";
const MARKETPLACE_CONTRACT_ADDRESS =
  "0xB142ca65005610D3dA999313552BFCe13B320EA2";

const OwnedNFTs2 = () => {
  const [nfts, setNfts] = useState<INFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(
        COLLECTION_CONTRACT_ADDRESS,
        TokenABI,
        signer
      );

      try {
        const address = await signer.getAddress();
        const tokenIds = await nftContract.getTokensOwned(address);

        const nftDetails = await Promise.all(
          tokenIds.map(async (tokenId: { toString: () => any }) => {
            try {
              let tokenURI = await nftContract.tokenURI(tokenId);
              if (tokenURI.startsWith("ipfs://")) {
                tokenURI = `https://ipfs.io/ipfs/${tokenURI.substring(7)}`;
              }
              const metadataResponse = await fetch(tokenURI);
              const metadata = await metadataResponse.json();
              return {
                tokenId: tokenId.toString(),
                name: metadata.name,
                description: metadata.description,
                image: metadata.image.startsWith("ipfs://")
                  ? `https://ipfs.io/ipfs/${metadata.image.substring(7)}`
                  : metadata.image,
                price: "", // Initialize the price as an empty string for each NFT
              };
            } catch (error) {
              console.error("Error fetching metadata:", error);
              return null;
            }
          })
        );

        setNfts(nftDetails.filter((detail) => detail !== null));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch NFTs:", error);
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const handlePriceChange = (tokenId: string, value: string) => {
    setNfts(
      nfts.map((nft) =>
        nft.tokenId === tokenId ? { ...nft, price: value } : nft
      )
    );
  };

  const handleSellOnMarketplace = async (tokenId: string, price: string) => {
    if (!price || isNaN(Number(price))) {
      alert("Please enter a valid price.");
      return;
    }

    setIsProcessing(true); // Start the loading indicator before initiating the transaction

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const nftContract = new ethers.Contract(
      COLLECTION_CONTRACT_ADDRESS,
      TokenABI,
      signer
    );
    const marketplaceContract = new ethers.Contract(
      MARKETPLACE_CONTRACT_ADDRESS,
      MarketplaceABI,
      signer
    );

    try {
      // Notify user about the transaction being sent
      const approvalTx = await nftContract.approve(
        MARKETPLACE_CONTRACT_ADDRESS,
        tokenId
      );
      await approvalTx.wait(); // Wait for the transaction to be mined

      const listTx = await marketplaceContract.listNFT(
        COLLECTION_CONTRACT_ADDRESS,
        tokenId,
        ethers.parseEther(price)
      );
      setIsProcessing(false); // Stop the loading indicator after the transaction completes
      await listTx.wait(); // Wait for the listing transaction to be mined
      setIsProcessing(true); // Stop the loading indicator after the transaction completes

      alert("NFT listed on the marketplace successfully!");
    } catch (error) {
      console.error("Error during the listing process:", error);
      alert("Failed to list NFT on the marketplace. See console for details.");
    } finally {
      setIsProcessing(false); // Stop the loading indicator after the transaction completes
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, position: "relative" }}>
      {isProcessing && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 2,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Typography variant="h5" sx={{ mb: 2 }}>
        My NFT Collection
      </Typography>
      <Grid container spacing={2}>
        {loading ? (
          <Typography>Loading NFTs...</Typography>
        ) : nfts.length > 0 ? (
          nfts.map((nft) => (
            <Grid item key={nft.tokenId} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={nft.image}
                  alt={nft.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {nft.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {nft.description}
                  </Typography>
                  <TextField
                    label="Price in ETH"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={nft.price}
                    onChange={(e) =>
                      handlePriceChange(nft.tokenId, e.target.value)
                    }
                    margin="dense"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleSellOnMarketplace(nft.tokenId, nft.price)
                    }
                    style={{ marginTop: 8 }}
                  >
                    Sell on Marketplace
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No NFTs found in your wallet.</Typography>
        )}
      </Grid>
    </Paper>
  );
};

export default OwnedNFTs2;
