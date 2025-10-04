"use client";

import React from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import OrganizationApproval from '@/components/OrganizationApproval';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const SolanaRewardDemo = () => {
  // Configure wallets
  const wallets = [
    new PhantomWalletAdapter(),
  ];

  const endpoint = clusterApiUrl('devnet'); // Use devnet for testing

  const handleApprovalComplete = (result) => {
    console.log('Reward approval completed:', result);
    // Handle the completion (e.g., redirect, show success message, etc.)
  };

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Solana Hackathon Reward System
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create and fund hackathon issues with SOL or SPL tokens. 
                Contributors receive rewards automatically upon task completion.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Organization Flow */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Organization: Fund Issue
                </h2>
                <OrganizationApproval 
                  issueId={null} // New issue
                  onApprovalComplete={handleApprovalComplete}
                />
              </div>

              {/* Flow Explanation */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Create & Fund Issue</h3>
                      <p className="text-gray-600 text-sm">
                        Organization specifies reward amount and approves token transfer to treasury
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Contributor Works</h3>
                      <p className="text-gray-600 text-sm">
                        Contributors see funded issues and work on solving them
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Automatic Reward</h3>
                      <p className="text-gray-600 text-sm">
                        Upon PR merge, system automatically sends reward to contributor's wallet
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Security Features</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Rate limiting (10 rewards/hour)</li>
                    <li>• Transaction verification</li>
                    <li>• Real-time treasury monitoring</li>
                    <li>• Fraud detection algorithms</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Technical Implementation</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Supported Tokens</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• SOL (Native Solana)</li>
                    <li>• SPL Tokens</li>
                    <li>• Custom token mints</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Supported Wallets</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Phantom</li>
                    <li>• Solflare</li>
                    <li>• Other Solana wallets</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Network</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Devnet (Testing)</li>
                    <li>• Mainnet (Production)</li>
                    <li>• Custom RPC endpoints</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* API Examples */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-2xl font-semibold mb-6">Integration Examples</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Environment Variables</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`SOLANA_RPC_URL=https://api.devnet.solana.com
TREASURY_PRIVATE_KEY=[Your_Treasury_Private_Key]
NEXT_PUBLIC_TREASURY_WALLET=[Treasury_Public_Key]`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Basic Usage</h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`import { rewardContributorForIssue } from '@/actions/rewardContributorForIssue';

// Reward a contributor
const result = await rewardContributorForIssue(
  githubIssueId,
  githubUsername
);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default SolanaRewardDemo;