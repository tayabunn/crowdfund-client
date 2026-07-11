"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  return (
    <motion.nav 
      className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-black text-2xl tracking-tight">CrowdFund</span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/explore" className="text-gray-600 hover:text-primary transition-colors font-medium">Explore Campaigns</Link>
            
            {!isLoading && !user ? (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary transition-colors font-medium">Login</Link>
                <Link href="/register" className="bg-primary text-white px-5 py-2.5 rounded-full font-bold hover:bg-primary-dark transition-all hover:shadow-lg hover:-translate-y-0.5">Register</Link>
              </>
            ) : !isLoading && user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors font-medium">Dashboard</Link>
                <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full">Credits: {user.credits}</span>
                <button onClick={logout} className="text-gray-600 hover:text-red-500 transition-colors font-medium">Logout</button>
              </>
            ) : null}
            
            <a href="#" className="border-2 border-primary text-primary px-5 py-2 rounded-full font-bold hover:bg-primary hover:text-white transition-all">Join as Developer</a>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6 text-gray-900" /> : <Menu className="block h-6 w-6 text-gray-900" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-white border-b border-gray-100 absolute w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link href="/explore" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Explore Campaigns</Link>
              {!isLoading && !user ? (
                <>
                  <Link href="/login" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Login</Link>
                  <Link href="/register" className="block px-3 py-3 rounded-md text-base font-bold text-primary bg-primary/5">Register</Link>
                </>
              ) : !isLoading && user ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">Dashboard</Link>
                  <button onClick={logout} className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-500 hover:bg-red-50">Logout</button>
                </>
              ) : null}
              <a href="#" className="block px-3 py-3 rounded-md text-base font-bold text-white bg-primary text-center mt-4">Join as Developer</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
