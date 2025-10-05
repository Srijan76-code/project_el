"use client";

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Coins, Plus } from "lucide-react";

// Dynamic import of wallet components to avoid SSR issues
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function TokenAssignment({ issueId }) {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const showNotification = (message) => {
    setNotificationMessage(message);
    setNotificationVisible(true);
    setTimeout(() => setNotificationVisible(false), 3000);
  };

  const handleTokenAssignment = async () => {
    if (!connected) {
      showNotification("Please connect your Phantom wallet");
      return;
    }

    try {
      setIsLoading(true);
      
      // Get treasury wallet from env
      const treasuryWallet = new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: treasuryWallet,
          lamports: Number(amount) * LAMPORTS_PER_SOL
        })
      );

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent:", signature);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      if (confirmation.value.err) throw new Error('Transaction failed');

      showNotification(`Successfully assigned ${amount} SOL to issue #${issueId}`);
      setIsOpen(false);
      setAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
      showNotification("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {notificationVisible && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-3">
          <div className="bg-green-900/90 text-white px-6 py-4 rounded-xl border border-green-500/50 shadow-lg">
            <p className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              {notificationMessage}
            </p>
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white 
                      flex items-center gap-2 rounded-full px-4 py-2 text-sm 
                      border border-blue-500/50 transition-all duration-300 
                      hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Assign Token
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[300px] bg-neutral-900 border border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              {connected ? 'Assign EOS Tokens' : 'Connect Wallet'}
            </DialogTitle>
          </DialogHeader>

          {connected ? (
            <>
              <div className="flex items-center gap-2 p-4">
                <Coins className="h-5 w-5 text-yellow-400" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="bg-neutral-800 border-neutral-700"
                />
                <span className="text-sm text-neutral-400">EOS</span>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleTokenAssignment}
                  disabled={isLoading || !amount}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="p-4">
              <WalletMultiButton className="w-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}