import { useConnect } from "wagmi";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <>
      <Paper>
        <Box>
          <Typography padding={"0.5rem"}>Connect to your wallet</Typography>
          {connectors.map((connector) => (
            <Box display={"flex"} flexDirection={"column"} key={connector.uid}>
              <Button
                variant="contained"
                sx={{ margin: "0.5rem" }}
                key={connector.uid}
                onClick={() => connect({ connector })}
              >
                {connector.name}
              </Button>
            </Box>
          ))}
        </Box>
      </Paper>
    </>
  );
}
