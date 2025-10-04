"use client";

import React, { useEffect, useState } from "react";
import { Search, Star, Coins } from "lucide-react";
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
import Link from "next/link";
import { getExplorePageRepos } from "@/actions/userProfile";

// const repositories = [
//   {
//     id: 1,
//     name: "react-dashboard",
//     description:
//       "A modern dashboard built with React and TypeScript featuring real-time analytics and data visualization.",
//     image: "https://api.dicebear.com/7.x/shapes/svg?seed=react-dashboard",
//     languages: ["TypeScript", "React", "CSS"],
//     stars: 1234,
//     tokens: 100,
//   },
//   {
//     id: 2,
//     name: "ai-chatbot",
//     description:
//       "Open source chatbot powered by machine learning with natural language processing capabilities.",
//     image: "https://api.dicebear.com/7.x/shapes/svg?seed=ai-chatbot",
//     languages: ["Python", "JavaScript", "HTML"],
//     stars: 2845,
//     tokens: 150,
//   },
//   {
//     id: 3,
//     name: "ui-component-library",
//     description:
//       "Beautiful and accessible component library for building modern web applications.",
//     image: "https://api.dicebear.com/7.x/shapes/svg?seed=ui-components",
//     languages: ["JavaScript", "CSS", "HTML"],
//     stars: 987,
//     tokens: 200,
//   },
// ];

const languageColors = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-blue-500",
  Python: "bg-blue-500",
  React: "bg-blue-500",
  CSS: "bg-blue-500",
  HTML: "bg-blue-500",
  "Node.js": "bg-blue-500",
  SQL: "bg-blue-500",
  "React Native": "bg-blue-500",
};

const MainRepository = () => {
  const [repositories, setRepositories] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const allLanguages = [...new Set(repositories.flatMap((repo) => repo.languages))];

  const filteredRepos = repositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      selectedLanguages.length === 0 ||
      repo.languages.some((lang) => selectedLanguages.includes(lang));

    return matchesSearch && matchesLanguage;
  });

  useEffect(() => {
    async function fetchData() {
      const { repositories } = await getExplorePageRepos()
      console.log("fetched repos: ", repositories)
      setRepositories(repositories)
    }
    fetchData()
  })

  return (
    <div className="space-y-10 w-full h-[calc(100vh-200px)] overflow-y-auto pr-2">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h2 className="text-4xl font-extrabold text-white drop-shadow-sm">
          All Repositories
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Explore all repositories available currently!
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
        {/* Search Bar */}
        <div className="relative w-full sm:w-2/3">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/40 via-cyan-400/30 to-indigo-500/40 blur-md opacity-70" />
          <div
            className="relative rounded-2xl border border-white/10 
                       bg-black/60 backdrop-blur-xl 
                       hover:bg-black/75 transition-all duration-300
                       shadow-[0_0_25px_rgba(0,150,255,0.15)]"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full rounded-2xl 
                         border-none bg-transparent text-white 
                         placeholder:text-gray-400
                         focus-visible:ring-2 focus-visible:ring-blue-500 
                         focus-visible:ring-offset-0
                         transition-all duration-300"
            />
          </div>
        </div>

        {/* Filter Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600
                       text-white font-semibold shadow-lg 
                       rounded-full px-6 py-2 text-sm
                       transition-all duration-300
                       hover:scale-105">
              Filter
            </Button>
          </DialogTrigger>

          <DialogContent
            className="sm:max-w-md w-full bg-black/70 backdrop-blur-xl rounded-3xl border border-gray-800 p-6 
               shadow-[0_20px_50px_rgba(0,150,255,0.25)] 
               animate-fade-in scale-95 transition-all duration-300"
          >
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold">
                Filter Repositories
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Select one or more languages to filter repositories
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex flex-wrap gap-3">
              {/* All button */}
              <Button
                key="All"
                size="sm"
                variant={selectedLanguages.length === 0 ? "default" : "outline"}
                className="rounded-full px-5 py-1.5 text-sm 
                   bg-gray-900 hover:bg-blue-950/50 
                   border border-gray-700 text-white 
                   transition-all duration-200
                   hover:scale-105"
                onClick={() => setSelectedLanguages([])}
              >
                All
              </Button>

              {allLanguages.map((lang) => (
                <Button
                  key={lang}
                  size="sm"
                  variant={selectedLanguages.includes(lang) ? "default" : "outline"}
                  className={`rounded-full px-5 py-1.5 text-sm transition-all duration-200
                      border ${selectedLanguages.includes(lang) ? "border-blue-500 bg-blue-500/20 text-white"
                      : "border-gray-700 bg-gray-900 text-gray-300"} 
                      hover:scale-105 hover:border-blue-400`}
                  onClick={() => {
                    setSelectedLanguages((prev) =>
                      prev.includes(lang)
                        ? prev.filter((l) => l !== lang)
                        : [...prev, lang]
                    );
                  }}
                >
                  {lang}
                </Button>
              ))}
            </div>

            <div className="mt-6 flex justify-between gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-gray-700 text-gray-300 
                   hover:bg-gray-900 hover:text-white transition-all duration-200"
                onClick={() => setSelectedLanguages([])}
              >
                Reset
              </Button>

              <DialogClose asChild>
                <Button
                  className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 
                     text-white font-medium transition-colors duration-200"
                >
                  Apply Filter
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Repository List */}
      <div className="space-y-6 w-[1200px] mx-auto">
        {filteredRepos.map((repo) => (
          <Link className="space-y-6" href={`/main/Repositories/${repo.id}`} key={repo.id}>
            <Card
              key={repo.id}
              className="group max-w-7xl mb-6 bg-neutral-950 border border-gray-800 
                       hover:border-blue-500 rounded-2xl shadow-md 
                       hover:shadow-blue-500/10 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6 w-full">
                  {/* Image */}
                  <div
                    className="h-16 w-16 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 
                             flex-shrink-0 group-hover:scale-105 transition"
                  >
                    <img
                      src={repo.image}
                      alt={repo.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-white group-hover:text-blue-500 transition">
                        {repo.name}
                      </h3>
                    </div>

                    <p className="text-base text-gray-400 max-w-4xl">
                      {repo.description}
                    </p>

                    {/* Languages */}
                    <div className="flex flex-wrap gap-2">
                      {repo.languages.map((lang) => (
                        <span
                          key={lang}
                          className="inline-flex items-center gap-1.5 px-3 py-1 
                                   rounded-full text-sm font-medium 
                                   bg-gray-900 text-gray-300 border border-gray-800 
                                   group-hover:border-blue-500/40 group-hover:text-white transition"
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${languageColors[lang] || "bg-blue-500"
                              }`}
                          ></span>
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-col items-end justify-center gap-4 text-sm text-gray-400 min-w-[120px]">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-5 w-5 text-blue-500" />
                      <span className="text-white text-base">{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coins className="h-5 w-5 text-yellow-400" />
                      <span className="text-white text-base">{repo.tokens} tokens</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredRepos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">🚫 No repositories found</p>
        </div>
      )}
    </div>
  );
};

export default MainRepository;
