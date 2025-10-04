import React from 'react';
import { Badge } from './badge';
import { motion } from 'framer-motion';

const ProfileHeader = ({username}) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
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
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-center p-6 rounded-xl border" 
        style={{ backgroundColor: 'rgb(38, 38, 38)', borderColor: 'rgb(23, 23, 23)' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-16 h-16 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: 'rgb(23, 23, 23)' }}
            variants={itemVariants}
          >
            <span className="text-xl font-semibold" style={{ 
              color: 'rgb(250, 250, 250)'
            }}>KG</span>
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
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: 'rgb(23, 23, 23)',
                    color: 'rgb(250, 250, 250)',
                    borderColor: 'rgb(38, 38, 38)',
                  }}
                >
                  React
                </Badge>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: 'rgb(23, 23, 23)',
                    color: 'rgb(250, 250, 250)',
                    borderColor: 'rgb(38, 38, 38)',
                  }}
                >
                  Python
                </Badge>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: 'rgb(23, 23, 23)',
                    color: 'rgb(250, 250, 250)',
                    borderColor: 'rgb(38, 38, 38)',
                  }}
                >
                  Rust
                </Badge>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Badge 
                  variant="secondary" 
                  style={{ 
                    backgroundColor: 'rgb(23, 23, 23)',
                    color: 'rgb(250, 250, 250)',
                    borderColor: 'rgb(38, 38, 38)',
                  }}
                >
                  C++
                </Badge>
              </motion.div>
            </motion.div>

          </div>
        </div>
  
        <motion.div 
          className="flex gap-4 mt-4 sm:mt-0"
          variants={itemVariants}
        >
          <button className="transition-colors hover:opacity-80" style={{ 
            color: 'rgb(250, 250, 250)'
          }}>GitHub</button>
        </motion.div>
      </motion.div>
    );
  };
  
  export default ProfileHeader;
  