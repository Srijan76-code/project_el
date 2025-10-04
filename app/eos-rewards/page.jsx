"use client";

import React, { useState, useEffect } from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import OrganizationApproval from '@/components/OrganizationApproval';
import { eosUtils, treasuryUtils } from '@/lib/solana-utils';
import { fetchTokenMetadata } from '@/EOS/eostoken';
import ClientOnly from '@/components/ClientOnly';

import '@solana/wallet-adapter-react-ui/styles.css';

const EosRewardDemo = () => {
  const [metadata, setMetadata] = useState(null);
  const [treasuryBalance, setTreasuryBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const wallets = [new PhantomWalletAdapter()];
  const endpoint = clusterApiUrl('devnet');

  useEffect(() => {
    loadEosData();
  }, []);

  const loadEosData = async () => {
    try {
      setLoading(true);
      const meta = await fetchTokenMetadata();
      setMetadata(meta);
      
      const treasuryBalanceData = await treasuryUtils.getEosBalance();
      setTreasuryBalance(treasuryBalanceData);
    } catch (error) {
      console.error('Error loading EOS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalComplete = (result) => {
    console.log('EOS reward approval completed:', result);
    loadEosData();
  };

  return (
    <ClientOnly fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Loading EOS Rewards...
            </h1>
          </div>
        </div>
      </div>
    }>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-8">
                {metadata?.image && (
                  <img 
                    src={metadata.image} 
                    alt={metadata.symbol} 
                    className="w-20 h-20 rounded-full mr-6 shadow-2xl border-4 border-white"
                  />
                )}
                <div>
                  <h1 className="text-5xl font-bold text-gray-900 mb-3">
                    {metadata?.name || 'EOS'} Hackathon Rewards
                  </h1>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg inline-block">
                    <p className="text-sm text-gray-600 font-mono">
                      🪙 {eosUtils.getMintAddress().slice(0, 16)}...
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                🚀 Create and fund hackathon issues with <strong>EOS tokens</strong> on Solana devnet. 
                Contributors receive rewards <strong>automatically</strong> upon task completion.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-purple-100 hover:shadow-2xl transition-all">
                <div className="text-4xl mb-2">💵</div>
                <div className="text-3xl font-bold text-purple-600">
                  ${eosUtils.getPrice().toFixed(3)}
                </div>
                <div className="text-sm text-gray-600 font-medium">USD per EOS</div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-blue-100 hover:shadow-2xl transition-all">
                <div className="text-4xl mb-2">🏦</div>
                <div className="text-3xl font-bold text-blue-600">
                  {treasuryBalance ? treasuryBalance.balance.toFixed(2) : '--'}
                </div>
                <div className="text-sm text-gray-600 font-medium">Treasury EOS Balance</div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-green-100 hover:shadow-2xl transition-all">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-3xl font-bold text-green-600">
                  ${treasuryBalance ? treasuryBalance.usdValue.toFixed(2) : '--'}
                </div>
                <div className="text-sm text-gray-600 font-medium">Treasury USD Value</div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-orange-100 hover:shadow-2xl transition-all">
                <div className="text-4xl mb-2">🌐</div>
                <div className="text-3xl font-bold text-orange-600">
                  Devnet
                </div>
                <div className="text-sm text-gray-600 font-medium">Solana Network</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Organization Flow */}
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center text-gray-900">
                  <span className="mr-3 text-4xl">🏢</span>
                  Organization Portal
                </h2>
                <OrganizationApproval 
                  issueId={null}
                  onApprovalComplete={handleApprovalComplete}
                />
              </div>

              {/* Process Flow */}
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-900">
                  <span className="mr-3 text-4xl">⚡</span>
                  How It Works
                </h2>
                <div className="space-y-8">
                  <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Fund with EOS</h3>
                      <p className="text-gray-600">
                        Organizations transfer EOS tokens to our secure treasury for specific GitHub issues
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Developer Contributes</h3>
                      <p className="text-gray-600">
                        Developers browse funded issues, work on solutions, and submit pull requests
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-5">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Instant Reward</h3>
                      <p className="text-gray-600">
                        EOS tokens are automatically sent to contributor's wallet upon PR merge
                      </p>
                    </div>
                  </div>
                </div>

                {/* EOS Token Info */}
                <div className="mt-10 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                    <span className="mr-2 text-2xl">🪙</span>
                    EOS Token Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-gray-600 mb-1">Symbol</div>
                      <div className="font-bold text-lg">{metadata?.symbol || 'EOS'}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-gray-600 mb-1">Decimals</div>
                      <div className="font-bold text-lg">{eosUtils.getDecimals()}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-gray-600 mb-1">Network</div>
                      <div className="font-bold">Solana Devnet</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-gray-600 mb-1">Standard</div>
                      <div className="font-bold">SPL Token</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100 hover:shadow-2xl transition-all">
                <div className="text-4xl mb-4 text-center">🔒</div>
                <h3 className="font-bold text-xl mb-4 text-center text-gray-900">Security First</h3>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Rate limiting protection</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Amount validation (1-1000 EOS)</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Transaction verification</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Fraud detection</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Real-time treasury monitoring</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-all">
                <div className="text-4xl mb-4 text-center">🚀</div>
                <h3 className="font-bold text-xl mb-4 text-center text-gray-900">Powerful Features</h3>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-center"><span className="text-blue-500 mr-2">⚡</span> Instant token transfers</li>
                  <li className="flex items-center"><span className="text-blue-500 mr-2">🔗</span> GitHub integration</li>
                  <li className="flex items-center"><span className="text-blue-500 mr-2">🤖</span> Automatic verification</li>
                  <li className="flex items-center"><span className="text-blue-500 mr-2">📊</span> Real-time balance tracking</li>
                  <li className="flex items-center"><span className="text-blue-500 mr-2">💼</span> Multi-wallet support</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 hover:shadow-2xl transition-all">
                <div className="text-4xl mb-4 text-center">🔧</div>
                <h3 className="font-bold text-xl mb-4 text-center text-gray-900">Built With</h3>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-center"><span className="text-purple-500 mr-2">⚿</span> Solana blockchain</li>
                  <li className="flex items-center"><span className="text-purple-500 mr-2">🪙</span> SPL token standard</li>
                  <li className="flex items-center"><span className="text-purple-500 mr-2">🌐</span> Devnet for testing</li>
                  <li className="flex items-center"><span className="text-purple-500 mr-2">👻</span> Phantom wallet</li>
                  <li className="flex items-center"><span className="text-purple-500 mr-2">⚛️</span> TypeScript & React</li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-12 text-center text-white">
              <h2 className="text-4xl font-bold mb-6">Ready to Start Rewarding Contributors?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join the future of hackathon rewards with EOS tokens on Solana
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{treasuryBalance ? treasuryBalance.balance.toFixed(0) : '0'}</div>
                  <div className="text-sm opacity-80">EOS Ready to Distribute</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">$0.05</div>
                  <div className="text-sm opacity-80">Per EOS Token</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">∞</div>
                  <div className="text-sm opacity-80">Potential Impact</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ClientOnly>
  );
};

export default EosRewardDemo;