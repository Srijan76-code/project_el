import React from "react";

const FeatureCard = ({ title, text, icon }) => (
  <div className="flex items-start space-x-4 text-left">
    <div className="p-2 rounded-full border border-blue-500 text-blue-400 bg-gray-800 shadow-lg flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-lg text-white mb-0.5">{title}</h4>
      <p className="text-gray-400 text-base leading-snug">{text}</p>
    </div>
  </div>
);

const About = () => {
  return (
    <section className="bg-black text-white py-28 px-8">
      <div className="text-center mb-24">
        <h3 className="text-sm text-blue-400 font-semibold mb-4 tracking-[0.3em] uppercase">
          WHY EOS
        </h3>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Build. <span className="text-blue-500">Contribute.</span> Earn.
        </h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-xl leading-relaxed">
          Start contributing, solve real issues, and earn rewards in EOS tokens. Work
          alongside peers, mentors, and organizations — and with dedication, you could
          <strong className="text-blue-400"> become a trusted maintainer in the ecosystem</strong>.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-24">
          <div className="flex flex-col space-y-20 w-80">
            <FeatureCard
              title="Collaborate Globally"
              text="Build and grow with contributors worldwide."
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <FeatureCard
              title="Build Your On-Chain Profile"
              text="Show your verified work and EOS rewards — proof of real impact."
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

           {/* Central Circle - Changed to an electric icon */}
           <div className="flex-shrink-0">
             <div className="relative w-64 h-64 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-950 to-gray-900 shadow-[0_0_50px_rgba(37,99,235,0.4)]" style={{animation: 'pulse 3s ease-in-out infinite'}}>
               <div className="w-24 h-24 bg-blue-500/90 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95" style={{animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'}}>
                 {/* Electric Icon SVG */}
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   className="h-10 w-10 fill-white"
                   style={{animation: 'bounce 2.5s ease-in-out infinite'}}
                   viewBox="0 0 24 24"
                   stroke="currentColor"
                   strokeWidth="0"
                 >
                   <path d="M13 3l-3 8H5l9 13 3-8h5l-9-13z" />
                 </svg>
               </div>
             </div>
           </div>

          <div className="flex flex-col space-y-20 w-80">
            <FeatureCard
              title="Level Up"
              text="Learn tools and workflows used by top Web3 teams."
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
            />
            <FeatureCard
              title="Get Recognized"
              text="Every task and issue solved boosts your reputation."
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { FeatureCard };
export default About;