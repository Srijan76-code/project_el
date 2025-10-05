"use client";

import { useEffect, useState } from 'react';
import AddRepo from './_components/AddRepo';
import { getGithubReposForUser } from '@/actions/orgProfile';
import { motion } from 'framer-motion';

const Page = () => {
  // const [repos, setRepos] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   async function fetchRepos() {
  //     try {
  //       const { repos, error } = await getGithubReposForUser();
  //       if (error) throw new Error(error);
  //       setRepos(repos || []);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchRepos();
  // }, []);

  // if (loading) return <div>Loading repositories...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Add Repository</h1>
        <AddRepo  />
      </motion.div>
    </div>
  );
};

export default Page;

