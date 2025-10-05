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
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import "@solana/wallet-adapter-react-ui/styles.css";

const EOS_TOKEN_MINT = "FVWUJ8Ut6kT2fSM6bHkGGTJ32FmjQ2VGvyLwSzBAknA8";

const WalletConnect = ({ onBalanceChange }) => {
	const network = "devnet";
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);
	const [wallets, setWallets] = useState([]);
	const [mounted, setMounted] = useState(false);
	const EOS_TOKEN_MINT = process.env.NEXT_PUBLIC_EOS_TOKEN_MINT;
	useEffect(() => {
		setMounted(true);
		setWallets([new PhantomWalletAdapter()]);
	}, []);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect={false}>
				<WalletModalProvider>
					{mounted ? <InnerWalletUI onBalanceChange={onBalanceChange} /> : null}
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

const InnerWalletUI = ({ onBalanceChange }) => {
	const { publicKey, connected } = useWallet();
	const [balance, setBalance] = useState(0);
	const connection = useMemo(() => new Connection(clusterApiUrl("devnet")), []);

	const fetchBalance = async () => {
		if (!publicKey) return;

		try {
			const tokenMintAddress = new PublicKey(EOS_TOKEN_MINT);

			const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
				publicKey,
				{ mint: tokenMintAddress }
			);

			if (tokenAccounts.value.length > 0) {
				const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
				console.log('EOS Token Balance:', balance);
				setBalance(balance);
				onBalanceChange?.(balance);
			} else {
				console.log('No EOS token account found');
				setBalance(0);
				onBalanceChange?.(0);
			}
		} catch (error) {
			console.error("Error fetching EOS balance:", error);
			setBalance(0);
			onBalanceChange?.(0);
		}
	};

	useEffect(() => {
		if (connected) {
			fetchBalance();
			const intervalId = setInterval(fetchBalance, 30000);
			return () => clearInterval(intervalId);
		} else {
			setBalance(0);
			onBalanceChange?.(0);
		}
	}, [connected, publicKey]);

	return (
		<div style={{ display: "flex", alignItems: "center" }}>
			<WalletMultiButton />
		</div>
	);
};

export default WalletConnect;
