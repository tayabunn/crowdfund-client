"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Hardcoded for now. Will be updated when auth context is added.
  const isLoggedIn = false; 

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-2xl tracking-tight">CrowdFund</span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/explore" className="text-gray-700 hover:text-primary transition-colors font-medium">Explore Campaigns</Link>
            
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary transition-colors font-medium">Login</Link>
                <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors">Register</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary transition-colors font-medium">Dashboard</Link>
                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Credits: 50</span>
                <button className="text-gray-700 hover:text-red-500 transition-colors font-medium">Logout</button>
              </>
            )}
            
            <a href="https://github.com/your-username/crowdfund-client" target="_blank" rel="noopener noreferrer" className="border border-primary text-primary px-4 py-2 rounded-md font-medium hover:bg-primary hover:text-white transition-colors">Join as Developer</a>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/explore" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Explore Campaigns</Link>
            {!isLoggedIn ? (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Login</Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50">Register</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Dashboard</Link>
                <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-50">Logout</button>
              </>
            )}
            <a href="https://github.com/your-username/crowdfund-client" className="block px-3 py-2 rounded-md text-base font-medium text-primary border border-primary text-center mt-4">Join as Developer</a>
          </div>
        </div>
      )}
    </nav>
  );
}
