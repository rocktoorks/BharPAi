
import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = "919717860064";
    const formattedMessage = encodeURIComponent(
      `Hello BharPAi,\n\nMy name is ${name}.\nMy email is ${email}.\n\nMessage: ${message}\n\n`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${formattedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Let's talk about how we can help you grow.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Contact Information</h3>
              <p className="text-gray-400">Fill up the form and our team will get back to you within 24 hours.</p>
            </div>
            <div className="space-y-4">
              <a href="tel:+919717860064" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                <Phone className="text-purple-400" />
                <span>+91-971 786 0064</span>
              </a>
              <a href="mailto:info@bharpai.com" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                <Mail className="text-purple-400" />
                <span>info@bharpai.com</span>
              </a>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input 
                type="text" 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300" 
                placeholder="Your Name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="your.email@example.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea 
                id="message" 
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:scale-105 transform transition-transform duration-300 shadow-lg">
              Send via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
