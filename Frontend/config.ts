import { http, createConfig } from "@wagmi/core";
import { sepolia, holesky } from "@wagmi/core/chains";
import { injected } from "@wagmi/connectors";

export const config = createConfig({
  chains: [sepolia, holesky],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
    [holesky.id]: http("https://rpc.holesky.ethpandaops.io"),
  },
});
