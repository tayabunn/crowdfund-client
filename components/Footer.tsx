import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start max-w-sm text-center md:text-left">
            <Link href="/" className="text-3xl font-bold text-primary mb-4 block">
              CrowdFund
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering ideas and transforming dreams into reality. Join our community to fund the next big thing or bring your own vision to life.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-center md:text-left">
              <li><Link href="/explore" className="text-gray-400 hover:text-primary transition-colors">Explore Campaigns</Link></li>
              <li><Link href="/login" className="text-gray-400 hover:text-primary transition-colors">Login</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-primary transition-colors">Register</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4 text-white">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors bg-gray-800 p-2 rounded-full"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors bg-gray-800 p-2 rounded-full"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors bg-gray-800 p-2 rounded-full"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors bg-gray-800 p-2 rounded-full"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors bg-gray-800 p-2 rounded-full"><Github size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CrowdFund. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
