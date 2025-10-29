
import React from 'react';
import type { Service } from '../types';
import ServiceCard from './ServiceCard';
import { PencilLine, Palette, Clapperboard, Bot, ImageUp, Code } from 'lucide-react'; // Placeholder icons

const Services: React.FC = () => {
  const services: Service[] = [
    {
      icon: PencilLine,
      title: 'AI Content & Copywriting',
      description: 'From blog posts to ad copy, get engaging content in minutes.',
      priceUSD: 20,
      priceINR: 1650,
    },
    {
      icon: Palette,
      title: 'AI Design & Branding',
      description: 'Generate logos, social media assets, and full brand kits.',
      priceUSD: 15,
      priceINR: 1200,
    },
    {
      icon: Clapperboard,
      title: 'AI Voice & Video Creation',
      description: 'Create professional voiceovers and short videos effortlessly.',
      priceUSD: 25,
      priceINR: 2000,
    },
    {
      icon: Bot,
      title: 'Automation & Chatbots',
      description: 'Deploy smart chatbots for customer support and lead generation.',
      priceUSD: 50,
      priceINR: 4000,
    },
    {
      icon: ImageUp,
      title: 'Image Enhancement & Analytics',
      description: 'Upscale, restore, and analyze images with powerful AI tools.',
      priceUSD: 5,
      priceINR: 400,
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our AI-Powered Services</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Affordable, powerful, and tailored for your growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
