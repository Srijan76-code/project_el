"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Coins, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

const issues = [
  {
    id: 101,
    title: "Fix navbar responsiveness",
    tags: ["frontend", "good first issue"],
    createdAt: "2025-10-05T04:00:00Z",
    repo: {
      name: "UI-Library",
      avatar: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
    },
    creator: {
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    tokens: 10,
    assignedTo: null,
  },
  {
    id: 102,
    title: "Implement authentication flow",
    tags: ["backend", "urgent"],
    createdAt: "2025-10-04T20:00:00Z",
    repo: {
      name: "Auth-Service",
      avatar: "https://avatars.githubusercontent.com/u/69631?s=200&v=4",
    },
    creator: {
      name: "Bob Smith",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    tokens: 20,
    assignedTo: {
      name: "Charlie Brown",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
  },
  {
    id: 103,
    title: "Update UI component library",
    tags: ["frontend", "enhancement"],
    createdAt: "2025-10-05T01:30:00Z",
    repo: {
      name: "Design-System",
      avatar: "https://avatars.githubusercontent.com/u/6154722?s=200&v=4",
    },
    creator: {
      name: "Diana Prince",
      avatar: "https://i.pravatar.cc/40?img=4",
    },
    tokens: 15,
    assignedTo: null,
  },
];

const tagColors = {
  frontend: "bg-blue-500",
  backend: "bg-green-500",
  "good first issue": "bg-yellow-400",
  urgent: "bg-red-500",
  enhancement: "bg-purple-500",
};

const RepoIssue = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = [...new Set(issues.flatMap((issue) => issue.tags))];

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTags.length === 0 ||
      issue.tags.some((tag) => selectedTags.includes(tag));
    return matchesSearch && matchesTag;
  });

  const hoursAgo = (dateStr) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    return Math.floor(diff / 1000 / 60 / 60);
  };

  return (
    <div className="space-y-10 w-full p-8">
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-transparent hover:bg-gray-800 text-white mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>
      {/* Header */}
      <div className="space-y-3 text-center">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-sm">
          Open Issues
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Browse, filter, and claim open issues to contribute
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
        <div className="relative w-full sm:w-2/3">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/40 via-cyan-400/30 to-indigo-500/40 blur-md opacity-70" />
          <div className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl hover:bg-black/75 transition-all duration-300 shadow-[0_0_25px_rgba(0,150,255,0.15)]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full rounded-2xl border-none bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 transition-all duration-300"
            />
          </div>
        </div>

        {/* Filter Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg rounded-full px-6 py-2 text-sm transition-all duration-300 hover:scale-105">
              Filter
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md w-full bg-black/70 backdrop-blur-xl rounded-3xl border border-gray-800 p-6 shadow-[0_20px_50px_rgba(0,150,255,0.25)] animate-fade-in scale-95 transition-all duration-300">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold">
                Filter Issues
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Select one or more tags to refine your issue list
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="sm"
                variant={selectedTags.length === 0 ? "default" : "outline"}
                className="rounded-full px-5 py-1.5 text-sm bg-gray-900 hover:bg-blue-950/50 border border-gray-700 text-white transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedTags([])}
              >
                All
              </Button>

              {allTags.map((tag) => (
                <Button
                  key={tag}
                  size="sm"
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`rounded-full px-5 py-1.5 text-sm transition-all duration-200 border ${
                    selectedTags.includes(tag)
                      ? "border-blue-500 bg-blue-500/20 text-white"
                      : "border-gray-700 bg-gray-900 text-gray-300"
                  } hover:scale-105 hover:border-blue-400`}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>

            <div className="mt-6 flex justify-between gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white transition-all duration-200"
                onClick={() => setSelectedTags([])}
              >
                Reset
              </Button>

              <DialogClose asChild>
                <Button className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200">
                  Apply Filter
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Issues List */}
      <div className="space-y-6 w-[1200px] mx-auto">
        {filteredIssues.map((issue) => (
          <Card
            key={issue.id}
            className="group max-w-7xl bg-neutral-950 border border-gray-800 hover:border-blue-500 rounded-2xl shadow-md hover:shadow-blue-500/10 transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6 w-full">
                {/* Repo avatar */}
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 flex-shrink-0 group-hover:scale-105 transition">
                  <img
                    src={issue.repo?.avatar || issue.creator.avatar}
                    alt={issue.repo?.name || issue.creator.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-500 transition">
                      #{issue.id} {issue.title}
                    </h3>
                    {issue.repo && (
                      <p className="text-sm text-gray-400 mt-1">
                        {issue.repo.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {issue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-900 text-gray-300 border border-gray-800 group-hover:border-blue-500/40 group-hover:text-white transition"
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            tagColors[tag] || "bg-blue-500"
                          }`}
                        ></span>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <img
                      src={issue.creator.avatar}
                      alt={issue.creator.name}
                      className="h-5 w-5 rounded-full"
                    />
                    <span>{issue.creator.name}</span>
                    <span className="text-gray-500">•</span>
                    <span>{hoursAgo(issue.createdAt)}h ago</span>
                  </div>
                </div>

                {/* Right Side Stats */}
                <div className="flex flex-col items-end justify-center gap-3 text-sm text-gray-400 min-w-[120px]">
                  <div className="flex items-center gap-1.5">
                    <Coins className="h-5 w-5 text-yellow-400" />
                    <span className="text-white text-base">
                      {issue.tokens}
                    </span>
                  </div>
                  {issue.assignedTo ? (
                    <div className="flex items-center gap-2 text-gray-300">
                      <img
                        src={issue.assignedTo.avatar}
                        alt={issue.assignedTo.name}
                        className="h-5 w-5 rounded-full"
                      />
                      <span>{issue.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">Unassigned</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">🚫 No issues found</p>
        </div>
      )}
    </div>
  );
};

export default RepoIssue;
