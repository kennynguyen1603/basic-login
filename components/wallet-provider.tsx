"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
// import { PontemWallet } from "@pontem/wallet-adapter-plugin";
// import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
// import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import toast from "react-hot-toast";
import { useAutoConnect } from "@/components/auto-connect-provider";

export const WalletProvider = ({ children }: PropsWithChildren<{}>) => {
  const { autoConnect } = useAutoConnect();

  const wallets = [
    // new BitgetWallet(),
    // new FewchaWallet(),
    // new MartianWallet(),
    // new MSafeWalletAdapter(),
    // new PontemWallet(),
    // new TrustWallet(),
    // new OKXWallet(),
  ];

  return (
    <AptosWalletAdapterProvider
      // plugins={wallets}
      autoConnect={autoConnect}
      dappConfig={{
        network: Network.DEVNET,
        aptosConnectDappId: "57fa42a9-29c6-4f1e-939c-4eefa36d9ff5",
      }}
      onError={(error: Error) => {
        console.error(error);
        toast.error(error.message || "Unknown wallet error");
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
