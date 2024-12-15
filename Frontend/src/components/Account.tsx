import { useAccount, useDisconnect } from "wagmi";
import { Box, Button, Paper, Typography, styled, Grid, Container } from "@mui/material";
import { keyframes } from "@emotion/react";

// Styled Gradient Button
const GradientButton = styled(Button)({
  background: "linear-gradient(45deg, #6a11cb, #2575fc)",
  color: "#fff",
  borderRadius: "20px",
  padding: "10px 20px",
  fontWeight: "bold",
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(45deg, #2575fc, #6a11cb)",
    transform: "scale(1.05)",
    transition: "transform 0.2s ease-in-out",
  },
});

// Styled Paper Component for Each Box
const InfoBox = styled(Paper)({
  backgroundColor: "#1e1e1e",
  color: "#fff",
  borderRadius: "20px",
  padding: "2rem",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
  textAlign: "left",
  height: "100%",
});

// Styled Big Info Box
const BigInfoBox = styled(Paper)({
  backgroundColor: "#1e1e1e",
  color: "#fff",
  borderRadius: "20px",
  padding: "2rem",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  width: "94%",
  marginBottom: "2rem", // Add space below the big box
  marginTop: "10rem",
});

// Bounce Animation for Arrow
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(10px);
  }
  60% {
    transform: translateY(5px);
  }
`;

// Scroll Down Section
const ScrollDownBox = styled(Box)({
  position: "absolute",
  bottom: "6rem", // Adjust vertical position
  width: "100%", // Ensures the box spans the entire width
  textAlign: "center", // Centers the content horizontally
  color: "#aaa",
  fontSize: "1rem",
  animation: `${bounce} 2s infinite`,
});

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
        fontFamily: "Roboto, sans-serif",
        display: "flex",
        flexDirection: "column", // Ensure everything stacks vertically
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        {/* Big Box: Project Info */}
        <BigInfoBox>
          <Typography
            variant="h4"
            sx={{ mb: 2, fontWeight: "bold", fontFamily: "Roboto, sans-serif" }}
          >
            🚀 Welcome to HuskyTVNft
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.2rem", lineHeight: "1.8", marginBottom: "1rem" }}
          >
            YouTube creators and streamers rely on ad revenue and brand
            integrations for income. With <strong>HuskyTVNft</strong>, they unlock a
            third revenue stream! 🎉 Creators can sell their videos and video
            thumbnails from trending content as NFTs. Empower your favorite
            creators and own a piece of internet history! 🌟
          </Typography>
        </BigInfoBox>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          sx={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          {/* Left Box: Marketplace Instructions */}
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
              >
                🛒 Marketplace Instructions
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                1️⃣ <strong>Connect Wallet:</strong> Ensure your wallet is
                connected.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                2️⃣ <strong>List NFT:</strong> Select the NFT and set a price.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                3️⃣ <strong>Approve Transaction:</strong> Confirm in your wallet.
              </Typography>
              <Typography variant="body1">
                4️⃣ <strong>Sell Successfully:</strong> Your NFT is listed! 🎉
              </Typography>
            </InfoBox>
          </Grid>

          {/* Center Box: Account Details */}
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
              >
                👤 Account Details
              </Typography>
              {address ? (
                <>
                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: "1rem",
                      fontFamily: "monospace",
                      backgroundColor: "#2a2a2a",
                      padding: "0.5rem",
                      borderRadius: "10px",
                      wordWrap: "break-word",
                    }}
                  >
                    {address}
                  </Typography>
                  <GradientButton
                    variant="contained"
                    onClick={() => disconnect()}
                    fullWidth
                  >
                    Disconnect
                  </GradientButton>
                </>
              ) : (
                <Typography variant="body1" sx={{ color: "#aaa" }}>
                  No account connected.
                </Typography>
              )}
            </InfoBox>
          </Grid>

          {/* Right Box: Minting Instructions */}
          <Grid item xs={12} sm={6} md={4}>
            <InfoBox>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
              >
                🎨 Minting Instructions
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                1️⃣ <strong>Upload File:</strong> Choose your NFT image or asset.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                2️⃣ <strong>Enter Details:</strong> Add name and description.
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                3️⃣ <strong>Approve Mint:</strong> Confirm the transaction.
              </Typography>
              <Typography variant="body1">
                4️⃣ <strong>Success:</strong> NFT minted and added to your wallet! 🚀
              </Typography>
            </InfoBox>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll Down Section */}
      <ScrollDownBox>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Scroll Down
        </Typography>
        <Box component="span" sx={{ fontSize: "2rem" }}>
          ⬇️
        </Box>
      </ScrollDownBox>
    </Box>
  );
}
