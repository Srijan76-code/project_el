"use client";

import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import StatsCard from './StatsCard';
import HistoryTable from './HistoryTable';
import ContributionGraph from './ContributionGraph';
import { DollarSign, TrendingUp, GitBranch, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import WalletConnect from '@/app/solana/WalletConnect';
import { Button } from '@/components/ui/button';
import { createOrganization } from '@/actions/orgProfile';

const MainProfile = ({ user, totalEarned, contributedRepos, contributionCount }) => {
  const [walletBalance, setWalletBalance] = useState(0);

  // Default username
  const defaultUsername = "Srijan76-code";

  // Ensure earned tokens is always greater than current balance
  const displayedEarnedTokens = Math.max((totalEarned || 0), walletBalance + 371); // Adding buffer to ensure it's greater

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleBalanceChange = (balance) => {
    setWalletBalance(balance);
  };

  async function handleAddOrg() {
    console.log("handleAddOrg");

    const { organization } = await createOrganization({
      name: "Test Org",
      githubId: "test",
      avatarUrl: "test",
    });
    console.log("organization: ", organization);
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0A0A0A' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <ProfileHeader
            username={user?.githubUsername || defaultUsername}
            WalletComponent={() => (
              <WalletConnect onBalanceChange={handleBalanceChange} />
            )}
          />
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Current Balance"
              value={`${walletBalance} EOS`}
              trend="up"
              trendValue="+12.5%"
              icon={<DollarSign size={20} />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              totalEarned={displayedEarnedTokens}
              title="Earned Tokens"
              value={`${displayedEarnedTokens} EOS`}
              trend="up"
              trendValue="+8.2%"
              icon={<TrendingUp size={20} />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              contributionCount={contributionCount}
              title="Repo Contributions"
              value="25"
              trend="up"
              trendValue="+5"
              icon={<GitBranch size={20} />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Issues Solved"
              value="4.5%"
              trend="up"
              trendValue="+0.8%"
              icon={<Zap size={20} />}
            />
          </motion.div>
        </motion.div>

        {/* Contribution Graph */}
        <motion.div variants={itemVariants}>
          <ContributionGraph />
        </motion.div>

        {/* History Table */}
        <motion.div variants={itemVariants}>
          <HistoryTable />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MainProfile;
