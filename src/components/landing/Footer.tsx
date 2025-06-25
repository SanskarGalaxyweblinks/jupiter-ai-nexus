
import React from 'react';
import { Link } from 'react-router-dom';
import JupiterBrainsLogo from '@/components/JupiterBrainsLogo';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 animate-fade-in">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="animate-fade-in-up animation-delay-200">
            <JupiterBrainsLogo size="md" variant="light" className="mb-4" />
            <p className="text-gray-400">
              Professional AI analytics and usage tracking for modern businesses.
            </p>
          </div>
          <div className="animate-fade-in-up animation-delay-400">
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Analytics</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Billing</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">API Management</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Security</Link></li>
            </ul>
          </div>
          <div className="animate-fade-in-up animation-delay-600">
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors duration-200">About</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Blog</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>
          <div className="animate-fade-in-up animation-delay-800">
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Documentation</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Help Center</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Status</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-200">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fade-in-up animation-delay-1000">
          <p>&copy; 2024 JupiterBrains. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
