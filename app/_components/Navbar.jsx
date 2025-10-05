import React from 'react';

const Navbar = () => {
  return (
    // Outer container for the Navbar: full width, fixed height (h-20), flex container.
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-8 md:px-16 lg:px-24 bg-transparent backdrop-blur-sm border-b border-white/20">

      {/* 1. Logo Section (Left) */}
      <div className="flex items-center space-x-2">
        {/* Logo Icon (Mimicking the yellow blocks) */}
        {/* <div className="flex">
          <div className="w-3 h-3 bg-yellow-400 border border-black"></div>
          <div className="w-3 h-3 bg-yellow-400 border border-black"></div>
        </div> */}
        {/* <div className="flex">
          <div className="w-3 h-3 bg-yellow-400 border border-black"></div>
          <div className="w-3 h-3 bg-yellow-400 border border-black"></div>
        </div> */}
        {/* Logo Text */}
        <span className="text-3xl font-bold tracking-tight text-white ml-4">Earn<span className="text-blue-500">OS</span></span>
      </div>

      {/* 2. Navigation Links (Center) */}
      {/* Hidden on mobile, flex on medium screens and up */}
      <div className="hidden md:flex items-center space-x-10 text-lg text-white font-medium">
        <a href="#home" className="hover:text-blue-300 transition duration-1550">Home</a>
        <a href="#about" className="hover:text-blue-300 transition duration-150">About</a>
        <a href="#collect" className="hover:text-blue-300 transition duration-150">Collect</a>
        <a href="#contact" className="hover:text-blue-300 transition duration-150">Contact</a>
      </div>

      {/* 3. Action Buttons (Right) */}
      <div className="flex items-center space-x-4">
        
        {/* Sign In Button (Transparent/Bordered) */}
        <button
          className="px-6 py-2 text-base font-medium text-white bg-transparent border border-white/30 rounded-md shadow-sm hover:bg-white/10 transition duration-150"
        >
          Sign In
        </button>
        
        {/* Login Button (Blue/Filled) */}
        <button
          className="px-6 py-2 text-base font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition duration-150"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;