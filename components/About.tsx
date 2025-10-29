
import React from 'react';
import { BrainCircuit } from 'lucide-react'; // Using a placeholder, but in a real project you'd install lucide-react

const TricolorAccent: React.FC = () => (
    <div className="h-1 w-24 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-full"></div>
);

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Us</h2>
          <div className="flex justify-center">
            <TricolorAccent />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <p className="text-lg text-gray-300 mb-6">
              BharPAi is a technology partner offering affordable, open-source AI solutions for businesses, creators, and startups. We bridge the gap between cutting-edge technology and real-world business needs.
            </p>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-500/30 shadow-lg">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">Our Mission</h3>
              <p className="text-gray-400">
                Making AI accessible for all. Leveraging Bharat’s growing tech ecosystem to empower small businesses and drive innovation from the ground up.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-30 animate-pulse"></div>
              <img src="https://picsum.photos/seed/ai-brain/400" alt="Abstract AI representation" className="relative w-full h-full object-cover rounded-full shadow-2xl"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
