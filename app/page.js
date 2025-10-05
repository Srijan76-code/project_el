// app/page.jsx (or pages/index.jsx in older Next.js)
import React from 'react';
import { Footer } from './_components/Footer';
import { Timeline } from './_components/Timeline';
import Contact from './_components/connect';
import Navbar from './_components/Navbar';
import Hero from './_components/Hero';
import About from './_components/About';

const timelineData = [
  {
    title: "Step 1",
    content: (
      <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm">
        <h4 className="text-lg font-semibold mb-2">Connect Your Wallet</h4>
        <p className="text-sm text-gray-300">
          Link your wallet to securely access your account and rewards.
        </p>
      </div>
    )
  },
  {
    title: "Step 2",
    content: (
      <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm">
        <h4 className="text-lg font-semibold mb-2">Select the Repositories</h4>
        <p className="text-sm text-gray-300">
          Browse and choose repositories from partnered organizations that match your interests or skills.
        </p>
      </div>
    )
  },
  {
    title: "Step 3",
    content: (
      <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm">
        <h4 className="text-lg font-semibold mb-2">Resolve the Issues</h4>
        <p className="text-sm text-gray-300">
          Pick an issue, contribute your solution, and submit your work for review.
        </p>
      </div>
    )
  },
  {
    title: "Step 4",
    content: (
      <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm">
        <h4 className="text-lg font-semibold mb-2">Earn EOS Tokens</h4>
        <p className="text-sm text-gray-300">
          Once your contribution is verified, you’ll automatically receive EOS tokens in your wallet — viewable in both EOS and USD.
        </p>
      </div>
    )
  }
];

const Page = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>
      <Hero/>
      <About/>
      <Timeline data={timelineData} />
      <Contact />
      <Footer />
    </div>
  );
};

export default Page;
