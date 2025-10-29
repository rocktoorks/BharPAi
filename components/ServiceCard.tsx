
import React from 'react';
import type { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const Icon = service.icon;

  return (
    <div className="bg-gray-800 rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transform hover:-translate-y-2 transition-all duration-300 group">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
      <p className="text-gray-400 mb-4 h-12">{service.description}</p>
      <div className="mt-auto pt-4 border-t border-gray-700/50">
        <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-400">
          From ${service.priceUSD} / ₹{service.priceINR.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-500">
            {service.title.includes('Image') ? 'per image' : service.title.includes('Content') ? 'per article' : service.title.includes('Design') ? 'per design' : service.title.includes('Video') ? 'per video' : 'per setup'}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
