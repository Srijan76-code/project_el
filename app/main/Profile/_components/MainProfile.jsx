"use client";

import React from 'react';
import ProfileHeader from './ProfileHeader';
import StatsCard from './StatsCard';
import HistoryTable from './HistoryTable';
import ContributionGraph from './ContributionGraph';
import { DollarSign, TrendingUp, GitBranch, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const MainProfile = () => {
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

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0A0A0A' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <ProfileHeader />
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <StatsCard 
              title="Current Balance" 
              value="$687.00" 
              trend="up"
              trendValue="+12.5%"
              icon={<DollarSign size={20} />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard 
              title="Lifetime Earnings" 
              value="$1,058.00" 
              trend="up"
              trendValue="+8.2%"
              icon={<TrendingUp size={20} />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard 
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
