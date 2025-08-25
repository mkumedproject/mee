import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">TA</div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Teachers Arena</h3>
                <p className="text-sm text-gray-400">Your Education Hub</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering educators with the latest news, resources, and insights in the education sector.
              Stay informed and connected with Teachers Arena.
            </p>
            <div className="flex space-x-4">
              <Facebook size={20} className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter size={20} className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Youtube size={20} className="text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
              <Instagram size={20} className="text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">All Posts</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white transition-colors text-sm">Categories</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/blog?category=education-news" className="text-gray-300 hover:text-white transition-colors text-sm">Education News</Link></li>
              <li><Link to="/blog?category=teacher-resources" className="text-gray-300 hover:text-white transition-colors text-sm">Teacher Resources</Link></li>
              <li><Link to="/blog?category=exam-information" className="text-gray-300 hover:text-white transition-colors text-sm">Exam Information</Link></li>
              <li><Link to="/blog?category=policy-updates" className="text-gray-300 hover:text-white transition-colors text-sm">Policy Updates</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-300 text-sm">contact@teachersarena.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-green-400" />
                <span className="text-gray-300 text-sm">+254 712 345 678</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-red-400" />
                <span className="text-gray-300 text-sm">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Teachers Arena. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;