"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { 
  createSolTransferTransaction, 
  createTokenTransferTransaction,
  getSolBalance,
  getTokenBalance,
  getEosBalance,
  treasuryUtils,
  eosUtils,
  isValidWalletAddress
} from "@/lib/solana-utils";
import { Connection } from "@solana/web3.js";
import ClientOnly from './ClientOnly';

const OrganizationApproval = ({ issueId, onApprovalComplete }) => {
  const { connected, publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Initialize connection
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  const [formData, setFormData] = useState({
    rewardAmount: "",
    tokenType: "EOS", // Default to EOS token
    tokenMintAddress: eosUtils.getMintAddress(), // EOS token mint
    issueTitle: "",
    githubIssueUrl: "",
  });
  const [walletBalance, setWalletBalance] = useState(0);
  const [treasuryAddress, setTreasuryAddress] = useState("");

  useEffect(() => {
    // Get treasury address from environment
    setTreasuryAddress(treasuryUtils.getPublicKey().toString());
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      fetchWalletBalance();
    }
  }, [connected, publicKey, formData.tokenType, formData.tokenMintAddress]);

  const fetchWalletBalance = async () => {
    try {
      if (formData.tokenType === "EOS") {
        const balanceData = await getEosBalance(publicKey.toString());
        setWalletBalance(balanceData.balance);
      } else if (formData.tokenType === "SOL") {
        const balance = await getSolBalance(publicKey.toString());
        setWalletBalance(balance);
      } else if (formData.tokenType === "SPL" && formData.tokenMintAddress) {
        const balance = await getTokenBalance(publicKey.toString(), formData.tokenMintAddress);
        setWalletBalance(balance);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      console.error("Failed to fetch wallet balance");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.rewardAmount || parseFloat(formData.rewardAmount) <= 0) {
      alert("Please enter a valid reward amount");
      return;
    }
    
    if (formData.tokenType === "SPL" && !isValidWalletAddress(formData.tokenMintAddress)) {
      alert("Please enter a valid token mint address");
      return;
    }
    
    if (parseFloat(formData.rewardAmount) > walletBalance) {
      alert("Insufficient balance for the reward amount");
      return;
    }
    
    setStep(2);
  };

  const handleApproveTransfer = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    setLoading(true);
    
    try {
      let transaction;
      const amount = parseFloat(formData.rewardAmount);
      
      console.log('Starting transaction approval process:', {
        amount,
        tokenType: formData.tokenType,
        from: publicKey.toString().slice(0, 8) + '...',
        to: treasuryAddress.slice(0, 8) + '...'
      });
      
      if (formData.tokenType === "EOS") {
        // For EOS token, check if token account exists first
        const userBalance = await getEosBalance(publicKey.toString());
        console.log('User EOS balance:', userBalance);
        
        if (userBalance < amount) {
          throw new Error(`Insufficient EOS balance. You have ${userBalance} EOS but trying to transfer ${amount} EOS`);
        }
        
        // Use SPL token transfer for EOS
        transaction = await createTokenTransferTransaction(
          publicKey.toString(),
          treasuryAddress,
          eosUtils.getMintAddress(),
          Math.floor(amount * (10 ** eosUtils.getDecimals())) // Convert to token units
        );
      } else if (formData.tokenType === "SOL") {
        // Check SOL balance
        const userBalance = await getSolBalance(publicKey.toString());
        console.log('User SOL balance:', userBalance);
        
        if (userBalance < amount + 0.01) { // Include fee
          throw new Error(`Insufficient SOL balance. You have ${userBalance} SOL but trying to transfer ${amount} SOL plus fees`);
        }
        
        transaction = await createSolTransferTransaction(
          publicKey.toString(),
          treasuryAddress,
          amount
        );
      } else {
        // For other SPL tokens
        const userBalance = await getTokenBalance(publicKey.toString(), formData.tokenMintAddress);
        console.log('User token balance:', userBalance);
        
        if (userBalance < amount) {
          throw new Error(`Insufficient token balance. You have ${userBalance} tokens but trying to transfer ${amount} tokens`);
        }
        
        transaction = await createTokenTransferTransaction(
          publicKey.toString(),
          treasuryAddress,
          formData.tokenMintAddress,
          amount
        );
      }

      console.log('Transaction created, requesting user approval...');

      // Send transaction for user approval  
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'processed'
      });
      
      console.log('Transaction signed, waiting for confirmation:', signature);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");
      
      console.log('Transaction confirmed, saving to database...');
      
      // Save to database via API call
      const response = await fetch("/api/organization/approve-reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issueId,
          rewardAmount: amount,
          tokenType: formData.tokenType,
          tokenMintAddress: formData.tokenMintAddress || null,
          transactionSignature: signature,
          organizationWallet: publicKey.toString(),
          treasuryWallet: treasuryAddress,
          issueTitle: formData.issueTitle,
          githubIssueUrl: formData.githubIssueUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save approval to database");
      }

      const result = await response.json();
      
      alert("Reward approved and transferred to treasury!");
      setStep(3);
      
      if (onApprovalComplete) {
        onApprovalComplete({
          signature,
          amount,
          tokenType: formData.tokenType,
          issueId: result.issueId,
        });
      }
      
    } catch (error) {
      console.error("Error approving transfer:", error);
      
      let errorMessage = "Failed to approve transfer";
      
      // Provide specific error messages for common issues
      if (error.message?.includes('insufficient')) {
        errorMessage = error.message;
      } else if (error.message?.includes('User rejected')) {
        errorMessage = "Transaction was cancelled by user";
      } else if (error.message?.includes('TokenAccountNotFoundError')) {
        errorMessage = "Token account not found. You may need to create a token account first.";
      } else if (error.message?.includes('Unexpected error')) {
        errorMessage = "Wallet error occurred. Please try again or check your wallet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      rewardAmount: "",
      tokenType: "SOL",
      tokenMintAddress: "",
      issueTitle: "",
      githubIssueUrl: "",
    });
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl border-2 border-gray-200" style={{ minHeight: '500px' }}>
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
        🏢 Approve EOS Reward
      </h2>

      {/* Debug Info */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        Step: {step} | Connected: {connected ? 'Yes' : 'No'} | Balance: {walletBalance}
      </div>

      {/* Step 1: Setup Reward */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-800">
              📝 Issue Title
            </label>
            <input
              type="text"
              value={formData.issueTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, issueTitle: e.target.value }))}
              placeholder="Enter issue title"
              required
              className="w-full p-4 border-2 border-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white text-gray-900"
              style={{ minHeight: '50px', fontSize: '16px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-800">
              🔗 GitHub Issue URL
            </label>
            <input
              type="url"
              value={formData.githubIssueUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, githubIssueUrl: e.target.value }))}
              placeholder="https://github.com/owner/repo/issues/123"
              required
              className="w-full p-4 border-2 border-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white text-gray-900"
              style={{ minHeight: '50px', fontSize: '16px' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-800">
              🪙 Reward Type
            </label>
            <select
              value={formData.tokenType}
              onChange={(e) => {
                const newTokenType = e.target.value;
                setFormData(prev => ({ 
                  ...prev, 
                  tokenType: newTokenType,
                  tokenMintAddress: newTokenType === "EOS" ? eosUtils.getMintAddress() : ""
                }));
              }}
              className="w-full p-4 border-2 border-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white text-gray-900"
              style={{ minHeight: '50px', fontSize: '16px' }}
            >
              <option value="EOS">🟣 EOS Token</option>
              <option value="SOL">☀️ SOL</option>
              <option value="SPL">🔷 Other SPL Token</option>
            </select>
          </div>

          {formData.tokenType === "SPL" && (
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-800">
                🎯 Token Mint Address
              </label>
              <input
                type="text"
                value={formData.tokenMintAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, tokenMintAddress: e.target.value }))}
                placeholder="Enter SPL token mint address"
                required
                className="w-full p-4 border-2 border-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white text-gray-900 font-mono text-sm"
                style={{ minHeight: '50px' }}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-800">
              💰 Reward Amount
            </label>
            <input
              type="number"
              step="0.000001"
              value={formData.rewardAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, rewardAmount: e.target.value }))}
              placeholder="Enter amount"
              required
              className="w-full p-4 border-2 border-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white text-gray-900 text-lg font-semibold"
              style={{ minHeight: '50px', fontSize: '16px' }}
            />
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm font-medium text-gray-700">
                💳 Available: <span className="text-purple-600 font-bold">{walletBalance}</span> {formData.tokenType === "EOS" ? "EOS" : formData.tokenType === "SOL" ? "SOL" : "tokens"}
                {formData.tokenType === "EOS" && (
                  <span className="text-green-600 ml-2">
                    (${(walletBalance * eosUtils.getPrice()).toFixed(2)} USD)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              🏦 Treasury Address:
            </p>
            <p className="text-xs font-mono break-all text-gray-600 bg-white p-2 rounded border">
              {treasuryAddress}
            </p>
          </div>

          {!connected ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                <p className="text-yellow-800 font-semibold">⚠️ Connect your wallet to continue</p>
              </div>
              <ClientOnly fallback={
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg text-lg">
                  Loading Wallet...
                </button>
              }>
                <WalletMultiButton style={{ width: '100%', justifyContent: 'center' }} />
              </ClientOnly>
            </div>
          ) : (
            <button 
              type="submit" 
              onClick={handleFormSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-lg"
              style={{ minHeight: '50px' }}
            >
              📋 Review Approval →
            </button>
          )}
        </div>
      )}

      {/* Step 2: Approve Transfer */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
            🔍 Review & Approve
          </h3>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-200 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-purple-200">
              <span className="font-semibold text-gray-800">📝 Issue:</span>
              <span className="text-right font-medium text-gray-900 max-w-xs truncate">{formData.issueTitle}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-purple-200">
              <span className="font-semibold text-gray-800">💰 Amount:</span>
              <span className="text-right font-bold text-lg text-purple-600">
                {formData.rewardAmount} {formData.tokenType}
                {formData.tokenType === "EOS" && (
                  <div className="text-sm text-green-600">
                    ≈ ${(parseFloat(formData.rewardAmount) * eosUtils.getPrice()).toFixed(2)} USD
                  </div>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-purple-200">
              <span className="font-semibold text-gray-800">📤 From:</span>
              <span className="text-xs font-mono text-right bg-white px-2 py-1 rounded border">
                {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-semibold text-gray-800">🏦 To Treasury:</span>
              <span className="text-xs font-mono text-right bg-white px-2 py-1 rounded border">
                {treasuryAddress.slice(0, 8)}...{treasuryAddress.slice(-8)}
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-800 mb-2">Important Notice</p>
                <p className="text-sm text-yellow-700">
                  This will transfer <strong>{formData.rewardAmount} {formData.tokenType}</strong> to our treasury. 
                  The funds will be automatically released to contributors when they complete the issue.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => setStep(1)} 
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-all"
            >
              ← Back
            </button>
            <button 
              onClick={handleApproveTransfer} 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "✅ Approve Transfer"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Complete */}
      {step === 3 && (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              Success! Reward Approved
            </h3>
            <p className="text-green-600 text-lg">
              Your EOS tokens have been transferred to the treasury!
            </p>
          </div>
          
          <div className="bg-white border-2 border-gray-200 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-4">📊 Transaction Summary</h4>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">💰 Amount:</span>
                <span className="font-bold text-purple-600">
                  {formData.rewardAmount} {formData.tokenType}
                  {formData.tokenType === "EOS" && (
                    <span className="text-sm text-gray-500 ml-2">
                      (${(parseFloat(formData.rewardAmount) * eosUtils.getPrice()).toFixed(2)} USD)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">📝 Issue:</span>
                <span className="font-medium text-gray-900 max-w-xs truncate">{formData.issueTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">🔗 URL:</span>
                <a 
                  href={formData.githubIssueUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View Issue →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <p className="text-blue-800 text-sm">
              <strong>🚀 Next Steps:</strong> Contributors can now work on this issue. 
              Once they submit a successful pull request, they'll automatically receive 
              the {formData.rewardAmount} {formData.tokenType} reward!
            </p>
          </div>

          <button 
            onClick={resetForm} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-lg text-lg"
          >
            🆕 Approve Another Reward
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationApproval;
