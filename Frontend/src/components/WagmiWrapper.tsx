import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useAccount } from "wagmi";
import { config } from "../../config";
import { ReactNode } from "react";
import { Account } from "./Account";
import { WalletOptions } from "./WalletOptions";
const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

function ConnectWallet({ children }: Props) {
  const { isConnected } = useAccount();
  if (isConnected) {
    return (
      <>
        <Account />
        {children}
      </>
    );
  } else {
    return <WalletOptions />;
  }
}

function WagmiWrapper({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet>{children}</ConnectWallet>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export { WagmiWrapper };
