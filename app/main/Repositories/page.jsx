"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MainIssues from "./_components/MainIssues";
import MainRepository from "./_components/MainRepository";

const tabs = [
  { id: "repositories", label: "Repositories", count: 134 },
  { id: "issues", label: "Issues", count: 458 }
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("repositories");

  return (
    <div className="p-8 space-y-8 w-full mx-auto">
      <header className="sticky top-0 bg-background z-10 pb-4">
        <h1 className="text-3xl font-bold">Contribute to Open Source</h1>
        <p className="text-muted-foreground">
          Explore repositories and track open issues.
        </p>
      </header>

      <div>
        <div className="flex space-x-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
              } relative px-1 pb-3 text-sm font-medium transition focus-visible:outline-2`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="bubble"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
              <span className="ml-2 text-muted-foreground">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 w-full flex items-center justify-center mx-auto">
          {activeTab === "repositories" && <MainRepository />}
          {activeTab === "issues" && <MainIssues />}
        </div>
      </div>
    </div>
  );
}
