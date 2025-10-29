
import React from 'react';
import { Linkedin, Instagram, Twitter } from 'lucide-react'; // Placeholder icons

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
        {children}
    </a>
);

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800/50">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <div className="text-center md:text-left">
                        <p className="text-gray-400">&copy; {new Date().getFullYear()} BharPAi. All rights reserved.</p>
                        <div className="mt-2 space-x-4 text-sm">
                            <a href="#" className="text-gray-500 hover:text-gray-300">Privacy Policy</a>
                            <span>|</span>
                            <a href="#" className="text-gray-500 hover:text-gray-300">Terms & Conditions</a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <SocialIcon href="#">
                            <Linkedin size={24} />
                        </SocialIcon>
                        <SocialIcon href="#">
                            <Instagram size={24} />
                        </SocialIcon>
                        <SocialIcon href="#">
                            <Twitter size={24} />
                        </SocialIcon>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
