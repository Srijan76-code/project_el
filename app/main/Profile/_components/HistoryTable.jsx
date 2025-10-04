"use client";

import React, { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { motion } from 'framer-motion';

const HistoryTable = () => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1
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
          duration: 0.4,
          ease: "easeOut"
        }
      }
    };

    const allHistory = [
      { repo: "React Dashboard", issue: "Bug fix", reward: "10x", date: "02/10/25", status: "Success" },
      { repo: "Node.js API", issue: "Feature", reward: "15x", date: "03/10/25", status: "Success" },
      { repo: "Database Migration", issue: "Docs", reward: "2x", date: "04/10/25", status: "Success" },
      { repo: "Authentication System", issue: "Security", reward: "20x", date: "05/10/25", status: "Success" },
      { repo: "UI Components", issue: "Enhancement", reward: "8x", date: "06/10/25", status: "Success" },
      { repo: "API Documentation", issue: "Documentation", reward: "5x", date: "07/10/25", status: "Success" },
      { repo: "Performance Optimization", issue: "Optimization", reward: "25x", date: "08/10/25", status: "Success" },
      { repo: "Testing Suite", issue: "Testing", reward: "12x", date: "09/10/25", status: "Success" },
      { repo: "Mobile App", issue: "UI Update", reward: "18x", date: "10/10/25", status: "Success" },
      { repo: "Backend Service", issue: "API Fix", reward: "7x", date: "11/10/25", status: "Success" },
      { repo: "Frontend Library", issue: "Component", reward: "14x", date: "12/10/25", status: "Success" },
      { repo: "DevOps Pipeline", issue: "Deployment", reward: "22x", date: "13/10/25", status: "Success" },
      { repo: "Data Analytics", issue: "Report", reward: "9x", date: "14/10/25", status: "Success" },
      { repo: "Cloud Infrastructure", issue: "Scaling", reward: "16x", date: "15/10/25", status: "Success" },
      { repo: "Security Audit", issue: "Vulnerability", reward: "30x", date: "16/10/25", status: "Success" },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(allHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const history = allHistory.slice(startIndex, startIndex + itemsPerPage);
  
    return (
      <motion.div 
        className="p-6 rounded-xl border mt-8" 
        style={{ backgroundColor: 'rgb(38, 38, 38)', borderColor: 'rgb(23, 23, 23)' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-6" variants={itemVariants}>
          <h3 className="text-lg font-semibold" style={{
            color: 'rgb(250, 250, 250)'
          }}>History</h3>
        </motion.div>
        
        <div className="overflow-x-auto rounded-lg" style={{ backgroundColor: 'rgb(23, 23, 23)' }}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottomColor: 'rgb(38, 38, 38)' }} className="border-b">
                <th className="px-4 py-3 text-sm font-medium text-left" style={{ 
                  color: 'rgb(250, 250, 250)'
                }}>Repo</th>
                <th className="px-4 py-3 text-sm font-medium text-left" style={{ 
                  color: 'rgb(250, 250, 250)',
                }}>Issue</th>
                <th className="px-4 py-3 text-sm font-medium text-center" style={{ 
                  color: 'rgb(250, 250, 250)',
                }}>Reward</th>
                <th className="px-4 py-3 text-sm font-medium text-center" style={{ 
                  color: 'rgb(250, 250, 250)',
                }}>Date</th>
                <th className="px-4 py-3 text-sm font-medium text-center" style={{ 
                  color: 'rgb(250, 250, 250)',
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <motion.tr 
                  key={i} 
                  style={{ borderBottomColor: 'rgb(38, 38, 38)' }} 
                  className="border-b hover:opacity-80 transition-colors"
                  variants={itemVariants}
                >
                  <td className="px-4 py-3" style={{ 
                    color: 'rgb(250, 250, 250)',
                  }}>{item.repo}</td>
                  <td className="px-4 py-3" style={{ 
                    color: 'rgb(250, 250, 250)',
                  }}>{item.issue}</td>
                  <td className="px-4 py-3 text-center font-medium" style={{ 
                    color: 'rgb(250, 250, 250)',
                  }}>{item.reward}</td>
                  <td className="px-4 py-3 text-center" style={{ 
                    color: 'rgb(250, 250, 250)',
                  }}>{item.date}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1"
                      style={{
                        backgroundColor: '#3B82F6',
                        color: 'rgb(250, 250, 250)',
                      }}
                    >
                      ✓ {item.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
              
              {/* Empty rows to maintain consistent table height */}
              {Array.from({ length: itemsPerPage - history.length }, (_, i) => (
                <tr key={`empty-${i}`} style={{ borderBottomColor: 'rgb(38, 38, 38)' }} className="border-b">
                  <td className="px-4 py-3" style={{ 
                    color: 'rgb(250, 250, 250)',
                    textShadow: '0 0 3px rgba(250, 250, 250, 0.1)'
                  }}>&nbsp;</td>
                  <td className="px-4 py-3" style={{ 
                    color: 'rgb(250, 250, 250)',
                    textShadow: '0 0 3px rgba(250, 250, 250, 0.1)'
                  }}>&nbsp;</td>
                  <td className="px-4 py-3 text-center" style={{ 
                    color: 'rgb(250, 250, 250)',
                    textShadow: '0 0 3px rgba(250, 250, 250, 0.1)'
                  }}>&nbsp;</td>
                  <td className="px-4 py-3 text-center" style={{ 
                    color: 'rgb(250, 250, 250)',
                    textShadow: '0 0 3px rgba(250, 250, 250, 0.1)'
                  }}>&nbsp;</td>
                  <td className="px-4 py-3 text-center">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <motion.div 
          className="flex items-center justify-center mt-6 pt-4" 
          style={{ borderTopColor: 'rgb(23, 23, 23)' }} 
          classname="border-t"
          variants={itemVariants}
        >
          <Pagination className="mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  style={{ 
                    backgroundColor: 'rgb(38, 38, 38)',
                    color: 'rgb(250, 250, 250)',
                    border: '1px solid rgb(23, 23, 23)'
                  }}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                    style={{ 
                      backgroundColor: currentPage === page ? 'rgb(59, 130, 246)' : 'rgb(38, 38, 38)',
                      color: 'rgb(250, 250, 250)',
                      border: '1px solid rgb(23, 23, 23)'
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  style={{ 
                    backgroundColor: 'rgb(38, 38, 38)',
                    color: 'rgb(250, 250, 250)',
                    border: '1px solid rgb(23, 23, 23)'
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      </motion.div>
    );
  };
  
  export default HistoryTable;
  