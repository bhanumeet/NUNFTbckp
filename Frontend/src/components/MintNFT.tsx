import { ChangeEvent, useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  TextField,
  Box,
  Paper,
  Typography,
  Button,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";

import { IMetadata } from "../interfaces/IMetadata";
import { ButtonProps } from "@mui/material/Button";

import TokenABI from "../abi/Token.abi.json";
const TOKEN_CONTRACT_ADDRESS = "0x53a70FFd8A76Bb50Dc018AdF84a6A96D3Da54Cb2";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CustomButton = styled(Button)<ButtonProps>({
  background: "linear-gradient(45deg, #6a11cb, #2575fc)", // Cool gradient
  color: "#fff",
  borderRadius: "20px",
  width: "fit-content", // Adjusts width to fit the content
  padding: "10px 20px", // Add padding for a nice shape
  display: "block", // Centering will require block display
  margin: "0 auto", // Center the button horizontally
  fontWeight: "bold", // Enhance text style
  textTransform: "none", // Disable uppercase text
  "&:hover": {
    background: "linear-gradient(45deg, #2575fc, #6a11cb)", // Reverse gradient on hover
    transform: "scale(1.05)", // Slight zoom effect
    transition: "transform 0.2s ease-in-out",
  },
});

const MintNFT: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [NFTName, setNFTName] = useState<string | null>("");
  const [NFTDescription, setNFTDescription] = useState<string | null>("");
  // const [NFTValue, setNFTValue] = useState<number>(0);

  const [cid, setCid] = useState<string | null>(null);
  const [metadataCid, setMetadataCid] = useState<string | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Use Effect to initialize the token contract.
  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          TOKEN_CONTRACT_ADDRESS,
          TokenABI,
          signer
        );
        setTokenContract(contract);
      } else {
        console.error("MetaMask not installed; using read-only defaults");
      }
    };

    initializeContract();
  }, []);

  //useEffect to update metadata CID.
  useEffect(() => {
    if (cid) {
      pinImageMetadataToIPFS();
    }
  }, [cid]);

  //useEffect to mint the NFT after metadataCID is fetched
  useEffect(() => {
    if (metadataCid) {
      mintNFT(`ipfs://${metadataCid}`);
    }
  }, [metadataCid]);

  //useEffect to clear the form.
  useEffect(() => {
    if (!isLoading) {
      clearForm();
    }
  }, [isLoading]);

  const mintNFT = async (_tokenURI: string) => {
    if (!tokenContract) {
      return;
    }

    try {
      const ownedTokenInfos = await tokenContract.createToken(_tokenURI);

      if (ownedTokenInfos.hash) {
        setIsLoading(false);
      }
    } catch (error) {
      if (error) {
        console.error("Transaction reverted with reason:", error);
      } else {
        console.error("An error occurred:", error);
      }
    }
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFileChange(event.target.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  // const handleNFTValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // Parse the input value to a number, handling cases where the input might not be a valid number
  //   const value = parseFloat(event.target.value);
  //   setNFTValue(isNaN(value) ? 0 : value);
  // };

  const handleNFTDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Parse the input value to a number, handling cases where the input might not be a valid number
    setNFTDescription(event.target.value);
  };

  const handleNFTNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNFTName(event.target.value);
  };

  //Pinning the image to IPFS using Pinata.
  const pinImageToIPFS = async (_selectedFile: File) => {
    try {
      const formData = new FormData();

      formData.append("file", _selectedFile);

      // Upload the image to IPFS
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      const imageCid = resData.IpfsHash;
      setCid(imageCid);
      console.log("Image IPFS hash:", imageCid);
    } catch (error) {
      console.log("Error while uploading image to Pinata: ", error);
    }
  };

  //Pinning Image Metadata to IPFS
  const pinImageMetadataToIPFS = async () => {
    if (cid && NFTName && NFTDescription) {
      // Create metadata based on the image's IPFS hash
      const metadata: IMetadata = {
        name: NFTName,
        description: NFTDescription,
        image: `ipfs://${cid}`,
        // attributes: [],
      };

      try {
        // Upload the metadata JSON to IPFS
        const metadataFormData = new FormData();
        metadataFormData.append(
          "file",
          new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );

        const metadataRes = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
            },
            body: metadataFormData,
          }
        );
        const metadataResData = await metadataRes.json();
        const metadataCid = metadataResData.IpfsHash;
        console.log("Metadata CID of the NFT:", metadataCid);
        setMetadataCid(metadataCid); //Metadata of the NFT
      } catch (error) {
        console.log("Error while uploading metadata to IPFS: ", error);
      }
    }
  };

  const handleSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      return;
    }

    setIsLoading(true);
    pinImageToIPFS(selectedFile);
  };

  // Clear form function
  const clearForm = (): void => {
    if (!isLoading) {
      setSelectedFile(null);
      setImageUrl("");
      setNFTName("");
      setNFTDescription("");
      // setNFTValue(0);
      setCid(null);
      setMetadataCid(null);
    }
  };

  return (
    <Paper
      sx={{
        backgroundColor: "#1e1e1e",
        color: "#fff",
        padding: "2rem",
        borderRadius: "20px",
      }}
    >
      {isLoading ? (
        <Box justifyContent={"center"}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          rowGap={2}
          component={"form"}
          onSubmit={handleSubmission}
          sx={{ textAlign: "center" }}
        >
          <Typography variant="h4" sx={{ fontFamily: "Roboto, sans-serif" }}>
            Mint NFT
          </Typography>

          <CustomButton
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{ borderRadius: "20px" }}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={handleFile}
            />
          </CustomButton>
          {imageUrl && (
            <Box display={"flex"} justifyContent={"center"}>
              <img src={imageUrl} style={{ height: "300px", width: "300px" }} />
            </Box>
          )}
          <TextField
              label="NFT Name"
              variant="outlined"
              value={NFTName}
              onChange={handleNFTNameChange}
              required
              InputLabelProps={{
                style: { color: "#fff", fontFamily: "Roboto, sans-serif" }, // Label color
              }}
              InputProps={{
                style: { color: "#fff", fontFamily: "Roboto, sans-serif" }, // Text color
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff", // Border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#aaa", // Hover border color
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff", // Focused border color
                  },
                },
              }}
/>
          <TextField
            label="NFT Description"
            variant="outlined"
            multiline
            value={NFTDescription}
            onChange={handleNFTDescChange}
            minRows={2}
            required
            InputLabelProps={{
              style: { color: "#fff", fontFamily: "Roboto, sans-serif" }, // Label color
            }}
            InputProps={{
              style: { color: "#fff", fontFamily: "Roboto, sans-serif" }, // Text color
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#fff", // Border color
                },
                "&:hover fieldset": {
                  borderColor: "#aaa", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fff", // Focused border color
                },
              },
            }}
          />

          {/* <TextField
            label="NFT Value"
            placeholder="0.01ETH"
            value={NFTValue}
            onChange={handleNFTValueChange}
            required
          /> */}
          <CustomButton variant="contained" type="submit" sx={{ borderRadius: "20px" }}>
            MINT NFT
          </CustomButton>
        </Box>
      )}
    </Paper>
  );
};

export { MintNFT };