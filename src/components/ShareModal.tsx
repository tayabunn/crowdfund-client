"use client";
import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  campaignId: string;
}

export default function ShareModal({ isOpen, onClose, campaignTitle, campaignId }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const url = typeof window !== 'undefined' ? `${window.location.origin}/explore/${campaignId}` : `https://crowdfund-client-xi.vercel.app/explore/${campaignId}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`Help support "${campaignTitle}" on CrowdFund!`);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      bg: 'bg-black text-white hover:bg-gray-800'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      bg: 'bg-emerald-600 text-white hover:bg-emerald-700'
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bg: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      name: 'Facebook',
      icon: 'f',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: 'bg-blue-700 text-white hover:bg-blue-800'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden font-sans"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Share2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Share this Campaign</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Spread the word to help reach the funding goal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={18} />
          </button>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {shareLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl ${item.bg} transition-transform hover:-translate-y-1 shadow-sm text-center`}
            >
              <span className="text-xl font-bold mb-1">{item.icon}</span>
              <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Input */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Campaign Direct Link</label>
          <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
            <input 
              type="text" 
              readOnly 
              value={url}
              className="w-full bg-transparent px-2 text-xs font-semibold text-gray-600 dark:text-gray-300 focus:outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-primary hover:bg-primary-dark text-white shadow-xs'
              }`}
            >
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
