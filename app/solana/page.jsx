import React from "react";
import WalletConnect from "./WalletConnect";

const page = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Solana (devnet) — Wallet Connect</h1>
      <WalletConnect />
    </div>
  );
};

export default page;
