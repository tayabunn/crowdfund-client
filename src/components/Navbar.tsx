"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sun, Moon, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav 
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-xs sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-[90%] mx-auto px-2 sm:px-4">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-black text-2xl tracking-tight">CrowdFund</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/explore" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium text-sm">
              Explore Campaigns
            </Link>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            {!isLoading && !user ? (
              <>
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium text-sm">
                  Login
                </Link>
                <Link href="/register" className="bg-primary text-white px-5 py-2.5 rounded-full font-bold hover:bg-primary-dark transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm">
                  Register
                </Link>
              </>
            ) : !isLoading && user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium text-sm">
                  Dashboard
                </Link>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
                  Credits: {user.credits}
                </span>
                <button onClick={logout} className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors font-medium text-sm cursor-pointer">
                  Logout
                </button>
              </>
            ) : null}
            
            <a 
              href="https://github.com/tayabunn/crowdfund-client" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border-2 border-primary text-primary px-4 py-1.5 rounded-full font-bold hover:bg-primary hover:text-white transition-all text-xs"
            >
              Developer Hub
            </a>
          </div>

          <div className="-mr-2 flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6 text-gray-900 dark:text-white" /> : <Menu className="block h-6 w-6 text-gray-900 dark:text-white" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 absolute w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link href="/explore" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800">
                Explore Campaigns
              </Link>
              {!isLoading && !user ? (
                <>
                  <Link href="/login" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800">
                    Login
                  </Link>
                  <Link href="/register" className="block px-3 py-3 rounded-md text-base font-bold text-primary bg-primary/5">
                    Register
                  </Link>
                </>
              ) : !isLoading && user ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-gray-800">
                    Logout
                  </button>
                </>
              ) : null}
              <a href="https://github.com/tayabunn/crowdfund-client" target="_blank" rel="noopener noreferrer" className="block px-3 py-3 rounded-md text-base font-bold text-white bg-primary text-center mt-4">
                Developer Hub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
