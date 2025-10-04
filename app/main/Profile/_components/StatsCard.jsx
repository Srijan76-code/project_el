import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, trend, trendValue, icon }) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    };

    const itemVariants = {
      hidden: { 
        opacity: 0, 
        y: -15,
        scale: 0.95
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: "easeOut"
        }
      }
    };

    return (
      <motion.div 
        className="p-6 rounded-xl border relative overflow-hidden" 
        style={{ 
          backgroundColor: 'rgb(38, 38, 38)', 
          borderColor: 'rgb(23, 23, 23)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3)'
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Shiny metallic glare effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 20%, rgba(255, 255, 255, 0.15) 45%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.15) 55%, transparent 80%)',
            transform: 'translateX(120%) translateY(120%)',
            width: '200%',
            height: '200%',
          }}
          animate={{
            transform: 'translateX(-120%) translateY(-120%)',
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 2.5,
          }}
        />
        
        {/* Secondary metallic highlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(250, 250, 250, 0.08) 50%, transparent 60%)',
            transform: 'translateX(100%) translateY(100%)',
            width: '150%',
            height: '150%',
          }}
          animate={{
            transform: 'translateX(-100%) translateY(-100%)',
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
        <div className="flex items-center justify-between mb-4">
          <motion.h4 
            className="text-sm font-medium" 
            style={{ color: 'rgb(250, 250, 250)' }}
            variants={itemVariants}
          >
            {title}
          </motion.h4>
          {icon && (
            <motion.div 
              style={{ color: 'rgb(250, 250, 250)' }}
              variants={itemVariants}
            >
              {icon}
            </motion.div>
          )}
        </div>
        <motion.p 
          className="text-3xl font-bold mb-3" 
          style={{ color: 'rgb(250, 250, 250)' }}
          variants={itemVariants}
        >
          {value}
        </motion.p>
        {trend && (
          <motion.div 
            className="flex items-center gap-2"
            variants={itemVariants}
          >
             <span className="text-sm font-medium" style={{
               color: trend === 'up' ? '#3B82F6' : 'rgb(239, 68, 68)'
             }}>
               {trendValue}
             </span>
             <span className="text-sm" style={{
               color: trend === 'up' ? '#3B82F6' : 'rgb(239, 68, 68)'
             }}>
              {trend === 'up' ? '↗' : '↘'}
            </span>
          </motion.div>
        )}
      </motion.div>
    );
  };
  
  export default StatsCard;
  