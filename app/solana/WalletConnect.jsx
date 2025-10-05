"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import {
	WalletModalProvider,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css"; // default styles for the wallet adapter UI

const WalletConnect = ({ onBalanceChange }) => {
	// Use devnet for this example
	const network = "devnet";
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);

	// Create adapters only on the client (after mount) to avoid SSR/client mismatch
	const [wallets, setWallets] = useState([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Create the adapter instance on the client only
		setWallets([new PhantomWalletAdapter()]);
	}, []);

	const InnerWalletUI = () => {
		const { publicKey, connected } = useWallet();
		const [balance, setBalance] = useState(0);
		const connection = useMemo(() => new Connection(clusterApiUrl("devnet")), []);

		const fetchBalance = async () => {
			if (!publicKey) return;
			try {
				const tokenMintAddress = new PublicKey(process.env.NEXT_PUBLIC_EOS_TOKEN_MINT);
				const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
					publicKey,
					{ mint: tokenMintAddress }
				);

				if (tokenAccounts.value.length > 0) {
					const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
					setBalance(balance);
					onBalanceChange?.(balance);
				}
			} catch (error) {
				console.error("Error fetching EOS balance:", error);
			}
		};

		useEffect(() => {
			if (connected) {
				fetchBalance();
				const intervalId = setInterval(fetchBalance, 30000);
				return () => clearInterval(intervalId);
			}
		}, [connected, publicKey]);

		return (
			<div style={{ display: "flex", alignItems: "center" }}>
				<WalletMultiButton
					style={{
						padding: '12px 24px',
						borderRadius: '8px',
						backgroundColor: 'rgb(38, 38, 38)',
						border: '1px solid rgb(23, 23, 23)',
						color: 'rgb(250, 250, 250)',
						fontSize: '14px',
						fontWeight: 500,
						transition: 'all 0.2s ease',
						cursor: 'pointer',
						'&:hover': {
							backgroundColor: 'rgb(45, 45, 45)'
						}
					}}
				/>
			</div>
		);
	};

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect={false}>
				<WalletModalProvider>
					{/* Render InnerWalletUI only after mount to keep SSR and client HTML stable */}
					{mounted ? <InnerWalletUI /> : null}
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export default WalletConnect;
