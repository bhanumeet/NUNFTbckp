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
  styled,
} from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { INFT } from "../interfaces/INFT";

import TokenABI from "../abi/Token.abi.json";
import MarketplaceABI from "../abi/Marketplace.abi.json";

const COLLECTION_CONTRACT_ADDRESS = "0x53a70FFd8A76Bb50Dc018AdF84a6A96D3Da54Cb2";
const MARKETPLACE_CONTRACT_ADDRESS = "0xB142ca65005610D3dA999313552BFCe13B320EA2";

// Styled Components
const StyledCard = styled(Card)({
  backgroundColor: "#2a2a2a",
  color: "#fff",
  borderRadius: "16px",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
});

const StyledCardContent = styled(CardContent)({
  backgroundColor: "#2a2a2a",
});

const CustomButton = styled(Button)<ButtonProps>({
  background: "linear-gradient(45deg, #6a11cb, #2575fc)",
  color: "#fff",
  borderRadius: "20px",
  padding: "10px 20px",
  fontWeight: "bold",
  textTransform: "none",
  width: "100%",
  marginTop: "16px",
  "&:hover": {
    background: "linear-gradient(45deg, #2575fc, #6a11cb)",
    transform: "scale(1.05)",
    transition: "transform 0.2s ease-in-out",
  },
});

const StyledPaper = styled(Paper)({
  backgroundColor: "#1e1e1e",
  color: "#fff",
  padding: "2rem",
  borderRadius: "20px",
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": {
      borderColor: "#fff",
    },
    "&:hover fieldset": {
      borderColor: "#aaa",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
    fontFamily: "Roboto, sans-serif",
  },
  "& .MuiInput-input": {
    color: "#fff",
    fontFamily: "Roboto, sans-serif",
  },
});

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
                price: "",
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

    setIsProcessing(true);

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
      const approvalTx = await nftContract.approve(
        MARKETPLACE_CONTRACT_ADDRESS,
        tokenId
      );
      await approvalTx.wait();

      const listTx = await marketplaceContract.listNFT(
        COLLECTION_CONTRACT_ADDRESS,
        tokenId,
        ethers.parseEther(price)
      );
      await listTx.wait();

      alert("NFT listed on the marketplace successfully!");
    } catch (error) {
      console.error("Error during the listing process:", error);
      alert("Failed to list NFT on the marketplace. See console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StyledPaper elevation={3} sx={{ position: "relative" }}>
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
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 2,
            borderRadius: "20px",
          }}
        >
          <CircularProgress sx={{ color: "#6a11cb" }} />
        </Box>
      )}

      <Typography
        variant="h4"
        sx={{ mb: 4, fontFamily: "Roboto, sans-serif", textAlign: "center" }}
      >
        My NFT Collection
      </Typography>
      
      <Grid container spacing={3}>
        {loading ? (
          <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#6a11cb" }} />
          </Box>
        ) : nfts.length > 0 ? (
          nfts.map((nft) => (
            <Grid item key={nft.tokenId} xs={12} sm={6} md={4}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="280"
                  image={nft.image}
                  alt={nft.name}
                  sx={{ objectFit: "cover" }}
                />
                <StyledCardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    sx={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    {nft.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#ccc", mb: 2, fontFamily: "Roboto, sans-serif" }}
                  >
                    {nft.description}
                  </Typography>
                  <StyledTextField
                    label="Price in ETH"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={nft.price}
                    onChange={(e) => handlePriceChange(nft.tokenId, e.target.value)}
                    margin="dense"
                  />
                  <CustomButton
                    onClick={() => handleSellOnMarketplace(nft.tokenId, nft.price)}
                  >
                    Sell on Marketplace
                  </CustomButton>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
            <Typography sx={{ color: "#ccc", fontFamily: "Roboto, sans-serif" }}>
              No NFTs found in your wallet.
            </Typography>
          </Box>
        )}
      </Grid>
    </StyledPaper>
  );
};

export default OwnedNFTs2;