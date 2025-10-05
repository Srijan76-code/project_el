"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Coins, ArrowLeft, Wallet, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
import { createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { getTokenBalance } from "@/EOS/eostoken";

import "@solana/wallet-adapter-react-ui/styles.css";

const issues = [
  {
    id: 101,
    title: "Fix navbar responsiveness",
    tags: ["frontend", "good first issue"],
    createdAt: "2025-10-05T04:00:00Z",
    repo: {
      name: "UI-Library",
      avatar: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
    },
    creator: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    tokens: 10,
    assignedTo: null,
  },
  {
    id: 102,
    title: "Implement authentication flow",
    tags: ["backend", "urgent"],
    createdAt: "2025-10-04T20:00:00Z",
    repo: {
      name: "Auth-Service",
      avatar: "https://avatars.githubusercontent.com/u/69631?s=200&v=4",
    },
    creator: {
      name: "Bob Smith",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    tokens: 20,
    assignedTo: {
      name: "Charlie Brown",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
  },
  {
    id: 103,
    title: "Update UI component library",
    tags: ["frontend", "enhancement"],
    createdAt: "2025-10-05T01:30:00Z",
    repo: {
      name: "Design-System",
      avatar: "https://avatars.githubusercontent.com/u/6154722?s=200&v=4",
    },
    creator: {
      name: "Diana Prince",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
    tokens: 15,
    assignedTo: null,
  },
];

const tagColors = {
  frontend: "bg-blue-500",
  backend: "bg-green-500",
  "good first issue": "bg-yellow-400",
  urgent: "bg-red-500",
  enhancement: "bg-purple-500",
};

// EOS Token Configuration
const EOS_TOKEN_MINT = new PublicKey("FVWUJ8Ut6kT2fSM6bHkGGTJ32FmjQ2VGvyLwSzBAknA8");
const TREASURY_WALLET = new PublicKey(process.env.NEXT_PUBLIC_TREASURY_WALLET || "4tMG74VFVyYRgd1hhMbNmcVi79KCxk9GiTiifdAG1o9h");

// AssignTokenButton Component
const AssignTokenButton = ({ issue, onTokenAssigned }) => {
  const { publicKey, sendTransaction } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userBalance, setUserBalance] = useState(null);

  // Load user balance when modal opens
  const loadUserBalance = async () => {
    if (publicKey) {
      try {
        const balance = await getTokenBalance(publicKey);
        setUserBalance(balance);
      } catch (err) {
        console.error("Failed to load balance:", err);
      }
    }
  };

  const handleAssignTokens = async () => {
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > 1000) {
      setError("Maximum amount is 1000 EOS");
      return;
    }

    if (userBalance && parseFloat(amount) > userBalance.balance) {
      setError("Insufficient EOS balance");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const connection = new (await import("@solana/web3.js")).Connection(clusterApiUrl("devnet"));
      
      // Get user's token account
      const userTokenAccount = await getAssociatedTokenAddress(
        EOS_TOKEN_MINT,
        publicKey
      );
      
      // Get treasury token account
      const treasuryTokenAccount = await getAssociatedTokenAddress(
        EOS_TOKEN_MINT,
        TREASURY_WALLET
      );
      
      // Convert amount to token units (6 decimals)
      const tokenAmount = parseFloat(amount) * 1000000;
      
      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        userTokenAccount,
        treasuryTokenAccount,
        publicKey,
        tokenAmount
      );
      
      // Create transaction
      const transaction = new Transaction().add(transferInstruction);
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");
      
      console.log(`✅ Token assignment successful! Signature: ${signature}`);
      console.log(`💰 Assigned ${amount} EOS to issue #${issue.id}`);
      
      // Call callback to update UI
      if (onTokenAssigned) {
        onTokenAssigned(issue.id, parseFloat(amount), signature);
      }
      
      setIsOpen(false);
      setAmount("");
      
    } catch (err) {
      console.error("Token assignment failed:", err);
      setError(err.message || "Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) loadUserBalance();
      if (!open) {
        setAmount("");
        setError("");
      }
    }}>
      <DialogTrigger asChild>
        <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg rounded-full px-6 py-2 text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Assign Token
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full bg-black/90 backdrop-blur-xl rounded-3xl border border-gray-800 p-6 shadow-[0_20px_50px_rgba(0,200,100,0.25)]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-400" />
            Assign EOS Tokens
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Assign EOS tokens to issue #{issue.id}: {issue.title}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {!publicKey ? (
            <div className="text-center">
              <p className="text-gray-400 mb-4">Connect your wallet to assign tokens</p>
              <WalletMultiButton className="!bg-purple-600 !hover:bg-purple-700" />
            </div>
          ) : (
            <>
              {userBalance && (
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-sm text-gray-400">Your EOS Balance</div>
                  <div className="text-lg font-bold text-green-400">
                    {userBalance.balance.toFixed(2)} EOS
                  </div>
                  <div className="text-xs text-gray-500">
                    ≈ ${userBalance.usdValue.toFixed(2)} USD
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Amount (EOS)</label>
                <Input
                  type="number"
                  placeholder="Enter amount (1-1000 EOS)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max="1000"
                  step="0.1"
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500"
                />
              </div>
              
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-2">
                  {error}
                </div>
              )}
              
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
                <div className="text-xs text-blue-300 font-medium mb-1">Treasury Wallet</div>
                <div className="text-xs text-gray-400 font-mono break-all">
                  {TREASURY_WALLET.toString()}
                </div>
              </div>
            </>
          )}
        </div>

        {publicKey && (
          <div className="mt-6 flex justify-between gap-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="flex-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
              onClick={handleAssignTokens}
              disabled={loading || !amount || parseFloat(amount) <= 0}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>Assign {amount || "0"} EOS</>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const RepoIssue = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [assignedTokens, setAssignedTokens] = useState({}); // Track assigned tokens per issue

  const allTags = [...new Set(issues.flatMap((issue) => issue.tags))];

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTags.length === 0 ||
      issue.tags.some((tag) => selectedTags.includes(tag));
    return matchesSearch && matchesTag;
  });

  const hoursAgo = (dateStr) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    return Math.floor(diff / 1000 / 60 / 60);
  };

  const handleTokenAssigned = (issueId, amount, signature) => {
    setAssignedTokens(prev => ({
      ...prev,
      [issueId]: {
        amount,
        signature,
        timestamp: new Date().toISOString()
      }
    }));
    
    // You could also call an API here to save the assignment to your database
    console.log(`Token assignment recorded for issue ${issueId}:`, { amount, signature });
  };

  // Wallet configuration
  const wallets = [new PhantomWalletAdapter()];
  const endpoint = clusterApiUrl('devnet');

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="space-y-10 w-full p-8">
            <Button
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-transparent hover:bg-gray-800 text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            {/* Header */}
            <div className="space-y-3 text-center">
              <h2 className="text-4xl font-extrabold text-white drop-shadow-sm">
                Open Issues
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Browse, filter, and assign tokens to open issues
              </p>
            </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
        <div className="relative w-full sm:w-2/3">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/40 via-cyan-400/30 to-indigo-500/40 blur-md opacity-70" />
          <div className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl hover:bg-black/75 transition-all duration-300 shadow-[0_0_25px_rgba(0,150,255,0.15)]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full rounded-2xl border-none bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-all duration-300"
            />
          </div>
        </div>

        {/* Filter Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg rounded-full px-6 py-2 text-sm transition-all duration-300 hover:scale-105">
              Filter
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md w-full bg-black/70 backdrop-blur-xl rounded-3xl border border-gray-800 p-6 shadow-[0_20px_50px_rgba(0,150,255,0.25)] animate-fade-in scale-95 transition-all duration-300">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold">
                Filter Issues
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Select one or more tags to refine your issue list
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="sm"
                variant={selectedTags.length === 0 ? "default" : "outline"}
                className="rounded-full px-5 py-1.5 text-sm bg-gray-900 hover:bg-blue-950/50 border border-gray-700 text-white transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedTags([])}
              >
                All
              </Button>

              {allTags.map((tag) => (
                <Button
                  key={tag}
                  size="sm"
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`rounded-full px-5 py-1.5 text-sm transition-all duration-200 border ${
                    selectedTags.includes(tag)
                      ? "border-blue-500 bg-blue-500/20 text-white"
                      : "border-gray-700 bg-gray-900 text-gray-300"
                  } hover:scale-105 hover:border-blue-400`}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>

            <div className="mt-6 flex justify-between gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white transition-all duration-200"
                onClick={() => setSelectedTags([])}
              >
                Reset
              </Button>

              <DialogClose asChild>
                <Button className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200">
                  Apply Filter
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Issues List */}
      <div className="space-y-6 w-[1200px] mx-auto">
        {filteredIssues.map((issue) => (
          <Card
            key={issue.id}
            className="group max-w-7xl bg-neutral-950 border border-gray-800 hover:border-blue-500 rounded-2xl shadow-md hover:shadow-blue-500/10 transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6 w-full">
                {/* Repo avatar */}
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 flex-shrink-0 group-hover:scale-105 transition">
                  <img
                    src={issue.repo?.avatar || issue.creator.avatar}
                    alt={issue.repo?.name || issue.creator.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-500 transition">
                      #{issue.id} {issue.title}
                    </h3>
                    {issue.repo && (
                      <p className="text-sm text-gray-400 mt-1">
                        {issue.repo.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {issue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-900 text-gray-300 border border-gray-800 group-hover:border-blue-500/40 group-hover:text-white transition"
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            tagColors[tag] || "bg-blue-500"
                          }`}
                        ></span>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <img
                      src={issue.creator.avatar}
                      alt={issue.creator.name}
                      className="h-5 w-5 rounded-full"
                    />
                    <span>{issue.creator.name}</span>
                    <span className="text-gray-500">•</span>
                    <span>{hoursAgo(issue.createdAt)}h ago</span>
                  </div>
                </div>

                {/* Right Side - Assign Token */}
                <div className="flex flex-col items-end justify-center gap-3 text-sm text-gray-400 min-w-[120px]">
                  {assignedTokens[issue.id] ? (
                    <div className="text-center">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Coins className="h-5 w-5 text-yellow-400" />
                        <span className="text-white text-base font-bold">
                          {assignedTokens[issue.id].amount} EOS
                        </span>
                      </div>
                      <div className="text-xs text-green-400 font-medium">
                        ✅ Funded
                      </div>
                    </div>
                  ) : (
                    <AssignTokenButton 
                      issue={issue} 
                      onTokenAssigned={handleTokenAssigned}
                    />
                  )}
                  
                  {issue.assignedTo ? (
                    <div className="flex items-center gap-2 text-gray-300">
                      <img
                        src={issue.assignedTo.avatar}
                        alt={issue.assignedTo.name}
                        className="h-5 w-5 rounded-full"
                      />
                      <span>{issue.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">Unassigned</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

            {filteredIssues.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">🚫 No issues found</p>
              </div>
            )}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default RepoIssue;