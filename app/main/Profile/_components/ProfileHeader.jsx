"use client";
import React from 'react';
import { Badge } from './badge';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ProfileHeader = ({ username, WalletComponent }) => {
  // Get initials from username
  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(/[-_\s]/)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

    const itemVariants = {
      hidden: { 
        opacity: 0, 
        y: -20,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: "easeOut"
        }
      }
    };

    return (
      <>
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-center p-6 rounded-xl border" 
        style={{ backgroundColor: 'rgb(23, 23, 23)', borderColor: 'rgb(38, 38, 38)' }}
        // variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-16 h-16 rounded-full overflow-hidden border-2" 
            style={{ backgroundColor: 'rgb(38, 38, 38)', borderColor: '#3B82F6' }}
            variants={itemVariants}
          >
            <Image
              src="/M1.png"
              alt="Profile Picture"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <motion.h3 
              className="text-xl font-semibold" 
              style={{ color: 'rgb(250, 250, 250)' }}
              variants={itemVariants}
            >
              {username} 
            </motion.h3>
            
            {/* Programming Language Badges */}
            <motion.div 
              className="flex flex-wrap gap-2 mt-3"
              // variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: 'rgb(38, 38, 38)',
                    color: 'rgb(250, 250, 250)',
                    borderColor: 'rgb(23, 23, 23)',
                  }}
                >
                  React
                </Badge>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: 'rgb(38, 38, 38)',
                    color: 'rgb(250, 250, 250)',
                    borderColor: 'rgb(23, 23, 23)',
                  }}
                >
                  Python
                </Badge>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: 'rgb(38, 38, 38)',
                    color: 'rgb(250, 250, 250)',
                    borderColor: 'rgb(23, 23, 23)',
                  }}
                >
                  Rust
                </Badge>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: 'rgb(38, 38, 38)',
                    color: 'rgb(250, 250, 250)',
                    borderColor: 'rgb(23, 23, 23)',
                  }}
                >
                  C++
                </Badge>
              </motion.div>
            </motion.div>

          </div>
        </div>
      
      <div className="flex items-center gap-4 mt-4 sm:mt-0">
        <WalletComponent />
        <Link
          href="/org"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors border px-3 py-2 border-white rounded-lg hover:opacity-80"
          style={{ color: 'rgb(250, 250, 250)' }}
        >
        Your Organisation
        </Link>
      </div>
    </motion.div>
    </>
  );
};

export default ProfileHeader;
