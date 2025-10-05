"use client";

import React, { useState, useEffect } from 'react';

const allHistory = [
  { repo: "React Dashboard", issue: "Bug fix", reward: "10 EOS", date: "02/10/25", status: "Success" },
  { repo: "Node.js API", issue: "Feature", reward: "15 EOS", date: "03/10/25", status: "Success" },
  { repo: "Database Migration", issue: "Docs", reward: "2 EOS", date: "04/10/25", status: "Success" },
  { repo: "Authentication System", issue: "Security", reward: "20 EOS", date: "05/10/25", status: "Success" },
  { repo: "UI Components", issue: "Enhancement", reward: "8 EOS", date: "06/10/25", status: "Success" },
  { repo: "API Documentation", issue: "Documentation", reward: "5 EOS", date: "07/10/25", status: "Success" },
  { repo: "Performance Optimization", issue: "Optimization", reward: "25 EOS", date: "08/10/25", status: "Success" },
  { repo: "Testing Suite", issue: "Testing", reward: "12 EOS", date: "09/10/25", status: "Success" },
  { repo: "Mobile App", issue: "UI Update", reward: "18 EOS", date: "10/10/25", status: "Success" },
  { repo: "Backend Service", issue: "API Fix", reward: "7 EOS", date: "11/10/25", status: "Success" },
];

const HistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;


  const history = allHistory.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);



  // FINAL UPDATE: Using border-b for thinness and adding mb-3 for padding under the line
  const headerHighlightClasses = "text-blue-500 text-lg font-bold uppercase pt-5 pb-2 border-b border-blue-500 tracking-wider mb-3";

  return (
    <motion.div
      className="p-6 rounded-xl border mt-8"
      style={{ backgroundColor: '#171717', borderColor: 'rgb(38, 38, 38)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-6" variants={itemVariants}>
        <h3 className="text-lg font-semibold" style={{
          color: 'rgb(250, 250, 250)'
        }}>History</h3>
      </motion.div>

      <div className="overflow-x-auto rounded-lg" style={{ backgroundColor: '#171717' }}>
        <table className="w-full text-left">
          <thead>
            {/* Applying the margin-bottom (mb-3) to the row to push the content down */}
            <tr className="mb-3">
              {/* Repo */}
              <th className={`text-left ${headerHighlightClasses} pl-4`}>Repo</th>

              {/* Issue */}
              <th className={`text-left ${headerHighlightClasses} px-4`}>Issue</th>

              {/* Reward */}
              <th className={`text-center ${headerHighlightClasses} px-4`}>Reward</th>

              {/* Date */}
              <th className={`text-center ${headerHighlightClasses} px-4`}>Date</th>

              {/* Status */}
              <th className={`text-center ${headerHighlightClasses} pr-4`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {contributedRepos.map((item, i) => (
              <motion.tr
                key={i}
                style={{ borderBottomColor: 'rgb(23, 23, 23)' }}
                className="border-b hover:opacity-80 transition-colors"
                variants={itemVariants}
              >
                {/* NOTE: Padding on table cells (td) remains px-4 py-3 */}
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
              <tr key={`empty-${i}`} style={{ borderBottomColor: 'rgb(23, 23, 23)' }} className="border-b">
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
        style={{ borderTopColor: 'rgb(38, 38, 38)' }}
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
                  backgroundColor: 'rgb(23, 23, 23)',
                  color: 'rgb(250, 250, 250)',
                  border: '1px solid rgb(38, 38, 38)'
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
                    backgroundColor: currentPage === page ? 'rgb(59, 130, 246)' : 'rgb(23, 23, 23)',
                    color: 'rgb(250, 250, 250)',
                    border: '1px solid rgb(38, 38, 38)'
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
                  backgroundColor: 'rgb(23, 23, 23)',
                  color: 'rgb(250, 250, 250)',
                  border: '1px solid rgb(38, 38, 38)'
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
