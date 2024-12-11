import { useAccount, useDisconnect } from "wagmi";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Paper, Typography } from "@mui/material";

//Also display ENS details

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Paper>
      <Box marginY={1} padding={1}>
        {address && (
          <>
            <Typography variant="h4">Account Address:</Typography>
            <Typography variant="h6">{address}</Typography>
          </>
        )}
        <Button variant="contained" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </Box>
    </Paper>
  );
}
