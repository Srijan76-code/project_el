
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
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css"; // default styles for the wallet adapter UI

const WalletConnect = () => {
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

	const InnerWalletUI = () => {
		const { publicKey, connected } = useWallet();
		const [balance, setBalance] = useState(null);
		const [usdValue, setUsdValue] = useState(null);
		const [metadata, setMetadata] = useState(null);
		const [loading, setLoading] = useState(false);
		const [error, setError] = useState(null);

		useEffect(() => {
			let mounted = true;
			const load = async () => {
				if (!connected || !publicKey) {
					setBalance(null);
					setMetadata(null);
					setError(null);
					return;
				}

				setLoading(true);
				setError(null);
				try {
					// dynamic import of helpers
					const { getTokenBalance, fetchTokenMetadata } = await import("../../EOS/eostoken");
					const [balObj, meta] = await Promise.all([
						getTokenBalance(publicKey),
						fetchTokenMetadata(),
					]);
					if (!mounted) return;

					// Normalize possible shapes of getTokenBalance result.
					// Expected: { balance: number, usdValue: number }
					const balNumber = balObj && typeof balObj === "object" ? Number(balObj.balance ?? balObj.amount ?? 0) : Number(balObj ?? 0);
					const usd = balObj && typeof balObj === "object" ? Number(balObj.usdValue ?? balObj.usd ?? 0) : 0;

					setBalance(Number.isFinite(balNumber) ? balNumber : 0);
					setUsdValue(Number.isFinite(usd) ? usd : 0);
					setMetadata(meta);
				} catch (err) {
					console.error("Error loading token data:", err);
					if (mounted) setError(String(err));
				} finally {
					if (mounted) setLoading(false);
				}
			};

			load();
			return () => {
				mounted = false;
			};
		}, [connected, publicKey]);

		return (
			<div style={{ display: "flex", gap: 16, alignItems: "center" }}>
				<WalletMultiButton />

				<div style={{ minWidth: 260, padding: 12, borderRadius: 8, border: "1px solid #e6e6e6" }}>
					{!connected && <div style={{ color: "#666" }}>Connect a wallet to see token balance</div>}

					{connected && (
						<div>
							<div style={{ marginBottom: 8, fontSize: 13, color: "#333" }}>
								Wallet: {publicKey ? publicKey.toBase58().slice(0, 6) + "..." + publicKey.toBase58().slice(-4) : "-"}
							</div>

							{loading && <div style={{ color: "#666" }}>Loading token data...</div>}

							{error && <div style={{ color: "#b00020" }}>Error: {error}</div>}

							{!loading && metadata && (
								<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
									{metadata.image && (
										// image may be a URL
										<img src={metadata.image} alt={metadata.symbol || metadata.name} style={{ width: 48, height: 48, borderRadius: 8 }} />
									)}
									<div>
										<div style={{ fontWeight: 600 }}>{metadata.symbol || metadata.name}</div>
										<div style={{ color: "#333" }}>
											{balance !== null ? `${balance} ${metadata.symbol || "TOK"}` : "0"}
											{usdValue !== null && usdValue !== undefined ? ` · $${usdValue.toFixed(2)}` : null}
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	};

	export default WalletConnect;
