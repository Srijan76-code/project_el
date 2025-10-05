"use client";

export default function Contact() {
  const contactMethods = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>
      ),
      title: "Join our community",
      desc: "Be part of our active developer space, share insights, and grow together.",
      link: {
        name: "Join our Discord",
        href: "javascript:void(0)",
      },
    },
    {
      icon: (
        <img 
          src="/x1.png" 
          alt="X (Twitter) logo" 
          className="w-8 h-8" 
        />
      ),
      title: "Follow us on X",
      desc: "Get instant updates, new releases, and behind-the-scenes insights.",
      link: {
        name: "Send us DMs",
        href: "javascript:void(0)",
      },
    },
  ];

  return (
    <section id="contact" className="py-20 bg-[#0A0A0A] text-gray-300">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="text-center mb-14">
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            Let’s Connect
          </h3>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            We’re here to help and answer any questions you might have.  
            Join our community and be part of the journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {contactMethods.map((item, idx) => (
            <div
              key={idx}
              className="relative group p-8 rounded-2xl border border-gray-800 bg-black/30 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition">
                {item.icon}
              </div>

              <h4 className="text-xl font-semibold text-white mt-6">
                {item.title}
              </h4>
              <p className="mt-2 text-gray-400">{item.desc}</p>

              <a
                href={item.link.href}
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-blue-400 hover:text-blue-300 transition"
              >
                {item.link.name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
