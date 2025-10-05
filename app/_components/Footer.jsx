'use client';
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FacebookIcon, FrameIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';

const footerLinks = [
  {
    label: 'Quick Links',
    links: [
      { title: 'Home', href: '#hero' },
      { title: 'About', href: '#about' },
      { title: 'Steps', href: '#timeline' },
      { title: 'Contact', href: '#contact' },
    ],
  },
  {
    label: 'Contact US',
    links: [
      { title: 'earnos@gmail.com', href: 'mailto:earnos@gmail.com' },
    ],
  },
  {
    label: 'Social Links',
    links: [
      { title: 'Instagram', href: '#', icon: InstagramIcon },
    ],
  },
];

export function Footer() {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-8xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(40%_160px_at_50%_0%,theme(colors.blue.500/25),theme(colors.gray.900)_60%,transparent)] px-6 py-12 lg:py-16">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4 ml-17 mt-6">
        <span className="text-3xl font-bold tracking-tight text-white ml-4">Earn<span className="text-blue-500">OS</span></span>
          <p className="text-blue-200 mt-8 text-sm md:mt-5">
            © {new Date().getFullYear()} EOS. All rights reserved.
          </p>
          <h3 className="text-blue-50 mt-8 text-sm md:mt-0">Contribute, Commit, Earn. <br/>The Open Source Economy, Driven by You.</h3>

        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-lg text-blue-300">{section.label}</h3>
                <ul className="text-blue-50 mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        onClick={(e) => link.href.startsWith('#') && handleScroll(e, link.href.slice(1))}
                        className="hover:text-foreground inline-flex items-center transition-all duration-300"
                      >
                        {link.icon && <link.icon className="me-1 size-4" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

function AnimatedContainer({ className, delay = 0.1, children }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
