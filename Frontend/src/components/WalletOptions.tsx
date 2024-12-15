import { useConnect } from "wagmi";
import { Box, Button, Typography, Paper, styled } from "@mui/material";

// Styled Paper for Wallet Box
const WalletBox = styled(Paper)({
  backgroundColor: "#1e1e1e",
  color: "#fff",
  borderRadius: "20px",
  padding: "2rem",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
  textAlign: "center",
  width: "100%",
  maxWidth: "400px",
});

// Styled Button for Wallet Options
const WalletButton = styled(Button)({
  background: "linear-gradient(45deg, #6a11cb, #2575fc)",
  color: "#fff",
  borderRadius: "20px",
  fontWeight: "bold",
  textTransform: "none",
  margin: "0.5rem",
  "&:hover": {
    background: "linear-gradient(45deg, #2575fc, #6a11cb)",
    transform: "scale(1.05)",
    transition: "transform 0.2s ease-in-out",
  },
});

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      <WalletBox>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", fontFamily: "Roboto, sans-serif" }}
        >
          Connect to Your Wallet
        </Typography>
        {connectors.map((connector) => (
          <WalletButton
            key={connector.id}
            variant="contained"
            onClick={() => connect({ connector })}
            fullWidth
          >
            {connector.name}
          </WalletButton>
        ))}
      </WalletBox>
    </Box>
  );
}
