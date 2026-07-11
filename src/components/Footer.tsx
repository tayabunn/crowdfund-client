"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="md:col-span-5 flex flex-col">
            <Link href="/" className="text-3xl font-black text-primary mb-6 inline-block tracking-tight">
              CrowdFund
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
              Empowering ideas and transforming dreams into reality. Join our global community to fund the next big thing or bring your own vision to life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors bg-gray-800 hover:bg-gray-700 p-2.5 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors bg-gray-800 hover:bg-gray-700 p-2.5 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors bg-gray-800 hover:bg-gray-700 p-2.5 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 2.16c3.203 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.647.07 4.851 0 3.204-.012 3.586-.07 4.852-.149 3.227-1.664 4.771-4.919 4.919-1.266.057-1.647.069-4.85.069-3.204 0-3.586-.012-4.851-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.647-.07-4.85 0-3.204.012-3.586.07-4.851.148-3.227 1.654-4.771 4.919-4.919 1.266-.057 1.648-.069 4.851-.069zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zm10.162 0a4.002 4.002 0 10-8.004 0 4.002 4.002 0 008.004 0zm1.406-6.648a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Fundraise for</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Medical</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Emergency</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Memorial</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Education</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Nonprofit</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Learn More</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">How CrowdFund works</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Why CrowdFund</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Common questions</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Success stories</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Supported countries</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Help center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">GoFundMe Stories</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Press center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Careers</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} CrowdFund. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Notice</Link>
            <Link href="#" className="hover:text-primary transition-colors">Legal</Link>
            <Link href="#" className="hover:text-primary transition-colors">Accessibility Statement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
