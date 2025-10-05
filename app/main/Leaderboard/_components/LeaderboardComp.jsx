"use client";
import React from "react";
import AnimatedList from "./animatedList";
import ProfileCard from "./profileCard";

const leaderboardData = [
  {
    name: "Sarah Chen",
    issues: 42,
    issuesSolved: 42,
    points: 450,
    photo: "/M1.png",
    languages: ["JavaScript", "TypeScript", "Node.js"]
  },
  {
    name: "Michael Rodriguez",
    issues: 35,
    issuesSolved: 35,
    points: 380,
    photo: "/M2.png",
    languages: ["Python", "Django", "React"]
  },
  {
    name: "Priya Patel",
    issues: 28,
    issuesSolved: 28,
    points: 320,
    photo: "/M3.png",
    languages: ["Java", "Spring", "Kotlin"]
  },
  {
    name: "James Kim",
    issues: 25,
    issuesSolved: 25,
    points: 290,
    languages: ["Go", "Rust", "Kubernetes"]
  },
  {
    name: "Aisha Johnson",
    issues: 24,
    issuesSolved: 24,
    points: 275,
    languages: ["C#", ".NET", "SQL"]
  },
  {
    name: "David Wilson",
    issues: 23,
    issuesSolved: 23,
    points: 260,
    languages: ["PHP", "Laravel", "Vue.js"]
  },
  {
    name: "Emma Davis",
    issues: 22,
    issuesSolved: 22,
    points: 240,
    languages: ["Ruby", "Rails", "React"]
  },
  {
    name: "Carlos Mendez",
    issues: 20,
    issuesSolved: 20,
    points: 220,
    languages: ["Python", "Flask", "Docker"]
  },
  {
    name: "Olivia Thompson",
    issues: 19,
    issuesSolved: 19,
    points: 210,
    languages: ["Swift", "iOS", "Firebase"]
  },
  {
    name: "Tyrone Williams",
    issues: 18,
    issuesSolved: 18,
    points: 200,
    languages: ["Dart", "Flutter", "Firebase"]
  }
];

// Get top 3 for profile cards and all for the list


const LeaderboardComp = () => {
  const topProfiles = leaderboardData.slice(0, 3);
const listItems = leaderboardData;
  return (
    <div className="min-h-screen bg-black text-white py-16 px-6 pt-35">
      {/* Header */}
      {/* <h1 className="text-center text-4xl font-bold text-blue-500 mb-12 tracking-wide">
        Leaderboard
      </h1> */}

      {/* Profile Cards Row */}
      <div className="flex flex-wrap justify-center items-end gap-20 mb-20">
        {/* Left (2nd place) */}
        <div className="scale-90 hover:scale-95 transition-transform duration-300">
          <ProfileCard profile={topProfiles[1]} />
        </div>

        {/* Center (1st place) */}
        <div className="scale-110 hover:scale-115 transition-transform duration-300">
          <ProfileCard profile={topProfiles[0]} />
        </div>

        {/* Right (3rd place) */}
        <div className="scale-90 hover:scale-95 transition-transform duration-300">
          <ProfileCard profile={topProfiles[2]} />
        </div>
      </div>

      {/* Animated List */}
      <div className="flex justify-center">
        <AnimatedList
          items={listItems}
          showGradients={true}
          enableArrowNavigation={true}
          displayScrollbar={true}
        />
      </div>
    </div>
  );
};

export default LeaderboardComp;
