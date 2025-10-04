"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ContributionGraph = () => {
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const data = [
    { day: 1, contributions: 0 },
    { day: 2, contributions: 2 },
    { day: 3, contributions: 7 },
    { day: 4, contributions: 9 },
    { day: 5, contributions: 3 },
    { day: 6, contributions: 0 },
    { day: 7, contributions: 2 },
    { day: 8, contributions: 1 },
    { day: 9, contributions: 0 },
    { day: 10, contributions: 2 },
    { day: 11, contributions: 0 },
    { day: 12, contributions: 2 },
    { day: 13, contributions: 0 },
    { day: 14, contributions: 3 },
    { day: 15, contributions: 0 },
    { day: 16, contributions: 1 },
    { day: 17, contributions: 0 },
    { day: 18, contributions: 0 },
    { day: 19, contributions: 0 },
    { day: 20, contributions: 0 },
    { day: 21, contributions: 9 },
    { day: 22, contributions: 1 },
    { day: 23, contributions: 2 },
    { day: 24, contributions: 1 },
    { day: 25, contributions: 6 },
    { day: 26, contributions: 5 },
    { day: 27, contributions: 1 },
    { day: 28, contributions: 1 },
    { day: 29, contributions: 5 },
    { day: 30, contributions: 8 }
  ];

  const maxContributions = Math.max(...data.map(d => d.contributions));
  const width = 1600;
  const height = 400;
  const padding = 60;

  const createPath = () => {
    const stepX = (width - 2 * padding) / (data.length - 1);
    const stepY = (height - 2 * padding) / maxContributions;
    let path = '';
    
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (point.contributions * stepY);
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  return (
    <motion.div 
      className="p-6 rounded-xl border" 
      style={{ backgroundColor: 'rgb(38, 38, 38)', borderColor: 'rgb(23, 23, 23)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'rgb(250, 250, 250)' }}>
            Contribution Graph
          </h3>
          <p className="text-sm" style={{ color: 'rgb(250, 250, 250)' }}>
            Your activity over time
          </p>
        </div>
      </motion.div>
      
      <motion.div className="w-full" variants={itemVariants}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ backgroundColor: 'rgb(23, 23, 23)', borderRadius: '8px' }}>
          {/* Grid lines */}
          {Array.from({ length: data.length }, (_, i) => (
            <line
              key={`x-${i}`}
              x1={padding + (i * (width - 2 * padding) / (data.length - 1))}
              y1={padding}
              x2={padding + (i * (width - 2 * padding) / (data.length - 1))}
              y2={height - padding}
              stroke="rgb(38, 38, 38)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          {Array.from({ length: maxContributions + 1 }, (_, i) => (
            <line
              key={`y-${i}`}
              x1={padding}
              y1={height - padding - (i * (height - 2 * padding) / maxContributions)}
              x2={width - padding}
              y2={height - padding - (i * (height - 2 * padding) / maxContributions)}
              stroke="rgb(38, 38, 38)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgb(250, 250, 250)" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="rgb(250, 250, 250)" strokeWidth="2" />

          {/* Labels */}
          {[5, 10, 15, 20, 25, 30].map(day => {
            const dayIndex = data.findIndex(d => d.day === day);
            if (dayIndex === -1) return null;
            return (
              <text
                key={day}
                x={padding + (dayIndex * (width - 2 * padding) / (data.length - 1))}
                y={height - padding + 20}
                textAnchor="middle"
                style={{ fill: 'rgb(250, 250, 250)', fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
              >
                {day}
              </text>
            );
          })}

          {Array.from({ length: maxContributions + 1 }, (_, i) => (
            <text
              key={i}
              x={padding - 10}
              y={height - padding - (i * (height - 2 * padding) / maxContributions) + 4}
              textAnchor="end"
              style={{ fill: 'rgb(250, 250, 250)', fontSize: '12px', fontFamily: 'Arial, sans-serif' }}
            >
              {i}
            </text>
          ))}

          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            style={{ fill: 'rgb(250, 250, 250)', fontSize: '14px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}
          >
            Days
          </text>
          <text
            x={20}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 20, ${height / 2})`}
            style={{ fill: 'rgb(250, 250, 250)', fontSize: '14px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}
          >
            Number of Contributions
          </text>

          {/* Blue Line + Glow */}
          <motion.path
            d={createPath()}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
            }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              delay: 1
            }}
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = padding + index * ((width - 2 * padding) / (data.length - 1));
            const y = height - padding - (point.contributions * ((height - 2 * padding) / maxContributions));
            
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="rgb(59, 130, 246)"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.8))'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.3 + (index * 0.05),
                  ease: "easeOut"
                }}
              />
            );
          })}
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ContributionGraph;
