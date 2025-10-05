'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { registerRepo } from '@/actions/orgProfile';

const repositories = [
  {
    id: 1,
    name: "project-el",
    description: "A decentralized open source contribution platform",
    stars: 128,
    forks: 45,
    language: "JavaScript",
    updatedAt: "2024-03-15T10:30:00Z"
  },
  {
    id: 2,
    name: "smart-contracts",
    description: "EOS smart contracts for project management",
    stars: 89,
    forks: 23,
    language: "C++",
    updatedAt: "2024-03-14T15:20:00Z"
  },
  {
    id: 3,
    name: "blockchain-api",
    description: "API for interacting with EOS blockchain",
    stars: 156,
    forks: 34,
    language: "TypeScript",
    updatedAt: "2024-03-13T09:45:00Z"
  },
  {
    id: 4,
    name: "token-manager",
    description: "EOS token management system",
    stars: 67,
    forks: 12,
    language: "Python",
    updatedAt: "2024-03-12T14:15:00Z"
  },
  {
    id: 5,
    name: "defi-dashboard",
    description: "Dashboard for DeFi analytics",
    stars: 234,
    forks: 56,
    language: "TypeScript",
    updatedAt: "2024-03-11T11:20:00Z"
  }
];

export default function AddRepo() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddRepository = async (repo) => {
    router.push('/org/AddRepos');
    // setLoading(true);
    // try {
    //   const response = await addRepositoryToOrg({
    //     ...repo,
    //     orgId: 1 // Replace with actual org ID from context/params
    //   });

    //   if (response.error) {
    //     throw new Error(response.error);
    //   }

    //   router.push('/org'); // Redirect back to org page
    //   router.refresh();
    // } catch (error) {
    //   console.error('Failed to add repository:', error);
    //   // Show error toast/message
    // } finally {
    //   setLoading(false);
    // }
  };

  // Filter repositories based on search
  const filteredRepos = repositories?.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0d0d0d 1px, transparent 1px),
            linear-gradient(to bottom, #0d0d0d 1px, transparent 1px),
            radial-gradient(circle 600px at 0% 200px, #1e40af30, transparent),
            radial-gradient(circle 600px at 100% 200px, #1e40af30, transparent)
          `,
          backgroundSize: '60px 60px, 60px 60px, 100% 100%, 100% 100%',
        }}
      />

      {/* Back button (top-left) */}
      <button
        type="button"
        aria-label="Go back"
        onClick={() => window.history.back()}
        className="cursor-pointer absolute top-4 left-4 sm:top-6 sm:left-6 z-30 flex items-center gap-2 text-gray-300 bg-neutral-900/70 backdrop-blur-md px-3 py-2 rounded-lg border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/70 transition-all text-sm font-medium shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-16 px-6 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-4xl font-bold mb-3 text-white tracking-tight">
            Let&apos;s build something new.
          </h1>
          <p className="text-gray-400 text-base">
            To add a new Repository, import an existing Git Repository.
          </p>
        </div>

        {/* Import Git Repository Card */}
        <div className="bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-xl border border-neutral-800/70">
          <h2 className="text-xl font-semibold mb-5 text-white tracking-tight">
            Import Git Repository
          </h2>

          {/* Search Bar */}
          <div className="flex items-center space-x-3 mb-5">
            {/* User Display */}
            <div className="flex items-center bg-neutral-800/80 px-4 py-2 rounded-xl border border-neutral-700 focus-within:border-neutral-500 transition whitespace-nowrap">
              <User className="text-gray-400 mr-2 w-4 h-4 shrink-0" />
              <p className="text-sm font-medium text-white tracking-tight m-0">abhiiiii-21</p>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search repositories..."
              className="bg-neutral-800/80 px-4 py-2 rounded-xl text-sm outline-none w-full border border-neutral-700 text-white placeholder-gray-500 focus:border-neutral-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Repository List */}
          <div
            className="space-y-3 overflow-y-auto pr-2"
            style={{
              maxHeight: '400px',
              scrollbarWidth: 'thin',
            }}
          >
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo, i) => (
                <Dialog key={i}>
                  <div className="flex items-center justify-between bg-neutral-800/80 hover:bg-neutral-700/80 transition-all p-4 rounded-xl border border-neutral-700">
                    <div>
                      <p className="text-sm font-medium text-white tracking-tight">{repo.name}</p>
                      {/* <p className="text-xs text-gray-500">{repo.time}</p> */}
                    </div>

                    {/* Import Button */}
                    <DialogTrigger asChild>
                      <button
                        onClick={() => setSelectedRepo(repo)}
                        className="bg-white hover:bg-neutral-200 text-black px-4 py-1.5 text-sm rounded-md font-medium transition-colors cursor-pointer shadow-sm"
                      >
                        Import
                      </button>
                    </DialogTrigger>
                  </div>

                  {/* Confirmation Dialog */}
                  <DialogContent className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 text-white shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Import Repository
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Are you sure you want to import{' '}
                        <span className="text-blue-400 font-medium">{repo.name}</span>?
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-6 flex justify-end gap-3">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="border-neutral-700 text-gray-300 hover:bg-neutral-800 hover:text-white rounded-md px-5"
                        >
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button
                        onClick={() => handleAddRepository(repo)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 shadow-lg transition"
                      >
                        Import
                      </Button>
                    </DialogFooter>
                  </DialogContent>

                </Dialog>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No repositories found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
