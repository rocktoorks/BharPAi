
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-600/20 animate-gradient-xy"></div>
        {/* Fix: Removed the `jsx` prop from the style tag as it's not standard in this React setup. */}
        <style>{`
          @keyframes gradient-xy {
            0%, 100% {
              background-size: 400% 400%;
              background-position: 0% 50%;
            }
            50% {
              background-size: 200% 200%;
              background-position: 100% 50%;
            }
          }
          .animate-gradient-xy {
            animation: gradient-xy 15s ease infinite;
          }
        `}</style>
      </div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-400">BharPAi</span>
          <span className="block md:inline"> – </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-300 to-orange-400">Bharat Powered AI</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          Empowering Entrepreneurs, Creators, and Startups with AI Solutions
        </p>
        <a href="#contact" className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
          Get Free Consultation
        </a>
      </div>
    </section>
  );
};

export default Hero;