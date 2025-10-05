"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeSection, setActiveSection] = useState('hero');

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setActiveSection(id);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['hero', 'about', 'timeline', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-8 md:px-16 lg:px-24 bg-transparent backdrop-blur-sm border-b border-white/20"
    >
      {/* Logo Section (Left) */}
      <motion.div 
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <span className="text-3xl font-bold tracking-tight text-white ml-4">Earn<span className="text-blue-500">OS</span></span>
      </motion.div>

      {/* Navigation Links (Center) */}
      <div className="hidden md:flex items-center space-x-10 text-lg text-white font-medium">
        <motion.a 
          href="#hero" 
          onClick={(e) => handleScroll(e, 'hero')}
          className={`transition duration-150 ${activeSection === 'hero' ? 'text-blue-500' : 'hover:text-blue-300'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Home
        </motion.a>
        <motion.a 
          href="#about" 
          onClick={(e) => handleScroll(e, 'about')}
          className={`transition duration-150 ${activeSection === 'about' ? 'text-blue-500' : 'hover:text-blue-300'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          About
        </motion.a>
        <motion.a 
          href="#timeline" 
          onClick={(e) => handleScroll(e, 'timeline')}
          className={`transition duration-150 ${activeSection === 'timeline' ? 'text-blue-500' : 'hover:text-blue-300'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Collect
        </motion.a>
        <motion.a 
          href="#contact" 
          onClick={(e) => handleScroll(e, 'contact')}
          className={`transition duration-150 ${activeSection === 'contact' ? 'text-blue-500' : 'hover:text-blue-300'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Connect
        </motion.a>
      </div>

      {/* Action Buttons (Right) */}
      <div className="flex items-center space-x-4">
        {isLoaded && !isSignedIn ? (
          <>
            <motion.button
              onClick={() => {
                router.push('/sign-in');
              }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-base font-medium text-white bg-transparent border border-white/30 rounded-md shadow-sm transition duration-150"
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={() => {
                router.push('/sign-up');
              }}
              whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-base font-medium text-white bg-blue-600 rounded-md shadow-sm transition duration-150"
            >
              Sign Up
            </motion.button>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-white">{user?.fullName}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;