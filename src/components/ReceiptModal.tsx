"use client";
import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReceiptData {
  transactionId: string;
  campaignTitle: string;
  creatorName: string;
  supporterName: string;
  supporterEmail: string;
  credits: number;
  rewardTitle?: string;
  date: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptData | null;
}

export default function ReceiptModal({ isOpen, onClose, data }: ReceiptModalProps) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden font-sans print:shadow-none print:border-none print:m-0"
      >
        {/* Actions bar */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Official Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-2xl font-black text-primary tracking-tight">CrowdFund</div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Contribution & Pledging Certificate</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold">Receipt Number:</span>
              <span className="font-mono font-bold text-gray-800 dark:text-gray-200">#{data.transactionId.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold">Date & Time:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{new Date(data.date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-semibold">Backer Name:</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{data.supporterName} ({data.supporterEmail})</span>
            </div>
          </div>

          <div className="space-y-3 border-y border-gray-100 dark:border-gray-800 py-4">
            <div>
              <div className="text-[11px] text-gray-400 font-bold uppercase">Supported Campaign</div>
              <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">{data.campaignTitle}</div>
              <div className="text-xs text-gray-500 mt-0.5">Created by {data.creatorName}</div>
            </div>

            {data.rewardTitle && (
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 rounded-xl">
                <div className="text-[10px] font-bold text-primary uppercase">Selected Reward Perk</div>
                <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">{data.rewardTitle}</div>
              </div>
            )}
          </div>

          {/* Amount Box */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl border border-primary/20">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Total Credits Contributed</div>
              <div className="text-xs text-primary font-semibold mt-0.5">Equivalent: ${(data.credits / 10).toFixed(2)} USD</div>
            </div>
            <div className="text-2xl font-black text-primary">
              {data.credits.toLocaleString()} <span className="text-xs font-bold">Credits</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-400 justify-center">
            <ShieldCheck size={14} className="text-emerald-500" />
            Cryptographically authenticated & recorded in CrowdFund Ledger
          </div>
        </div>
      </motion.div>
    </div>
  );
}
