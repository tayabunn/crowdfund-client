"use client";
import React, { useState } from 'react';
import { Sparkles, X, Wand2, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiCampaignData {
  title: string;
  category: string;
  funding_goal: number;
  minimum_contribution: number;
  reward_info: string;
  story: string;
  funding_type: 'flexible' | 'fixed';
  rewards: Array<{
    title: string;
    description: string;
    amount: number;
    estimated_delivery: string;
    items: string[];
    max_slots?: number;
  }>;
  stretch_goals: Array<{
    amount: number;
    title: string;
    description: string;
  }>;
}

interface AiCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: AiCampaignData) => void;
}

export default function AiCampaignModal({ isOpen, onClose, onApply }: AiCampaignModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<AiCampaignData | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const lower = prompt.toLowerCase();
      let category = 'Technology';
      if (lower.includes('art') || lower.includes('film') || lower.includes('comic') || lower.includes('music')) {
        category = 'Art';
      } else if (lower.includes('health') || lower.includes('medical') || lower.includes('clinic') || lower.includes('disease')) {
        category = 'Health';
      } else if (lower.includes('community') || lower.includes('garden') || lower.includes('clean') || lower.includes('water')) {
        category = 'Community';
      } else if (lower.includes('school') || lower.includes('education') || lower.includes('book') || lower.includes('learn')) {
        category = 'Education';
      } else if (lower.includes('relief') || lower.includes('disaster') || lower.includes('flood') || lower.includes('earthquake')) {
        category = 'Disaster Relief';
      }

      const cleanPrompt = prompt.trim();
      const baseGoal = 10000;

      const aiResult: AiCampaignData = {
        title: `${cleanPrompt.slice(0, 1).toUpperCase() + cleanPrompt.slice(1)}: Empowering the Future`,
        category,
        funding_goal: baseGoal,
        minimum_contribution: 100,
        reward_info: `Backers will receive exclusive prototype access, customized merchandise, digital certificates, and VIP credits.`,
        funding_type: 'flexible',
        story: `## The Vision Behind Our Campaign\n\n${cleanPrompt}.\n\n### The Problem We Are Solving\nMany promising initiatives struggle to bridge the gap between initial ideation and global community scale. Without accessible capital and community backing, breakthrough innovations often stall.\n\n### Our Proposed Solution\nWith this project, we are developing a robust, transparent framework designed for real-world impact. Every dollar and credit pledged goes directly toward prototyping, manufacturing, testing, and distribution.\n\n### Why Your Backing Matters\nBy backing us today, you aren't just donating—you are becoming an integral partner in bringing this vision to life. You'll receive continuous milestone updates, backer perks, and direct engagement with our development team.`,
        rewards: [
          {
            title: "Early Bird Supporter",
            description: "Get your name in the project credits, digital thank-you certificate, and private backer updates.",
            amount: 250,
            estimated_delivery: "Within 2 months of funding",
            items: ["Digital Backer Badge", "Name in Hall of Fame", "Private Dev Newsletter"],
            max_slots: 50
          },
          {
            title: "Standard Edition Package",
            description: "Everything in Early Bird plus physical commemorative merchandise and priority beta access.",
            amount: 750,
            estimated_delivery: "Within 4 months of funding",
            items: ["Early Bird Rewards", "Custom Branded Merch", "Beta Access Pass"],
            max_slots: 100
          },
          {
            title: "VIP Founder's Tier",
            description: "Complete package including 1-on-1 strategy call with our creators and lifetime VIP recognition.",
            amount: 2500,
            estimated_delivery: "Within 6 months of funding",
            items: ["All Previous Perks", "Exclusive 1-on-1 Creator Call", "Lifetime VIP Discord Role"],
            max_slots: 15
          }
        ],
        stretch_goals: [
          {
            amount: 15000,
            title: "Mobile App Companion Release",
            description: "Unlocks dedicated iOS and Android companion app with real-time tracking."
          },
          {
            amount: 25000,
            title: "Global Distribution & Multi-Language Support",
            description: "Translates the platform into 5 languages and enables subsidized international shipping."
          }
        ]
      };

      setGeneratedData(aiResult);
      setIsGenerating(false);
    }, 1100);
  };

  const handleApply = () => {
    if (generatedData) {
      onApply(generatedData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-md shadow-primary/20">
              <Sparkles size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">AI Campaign Co-Pilot</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Describe your project idea and let AI structure the whole campaign.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              What is your project about?
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A solar-powered portable water filtration bottle for hikers and disaster relief responders..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Generating Campaign Blueprint...
              </>
            ) : (
              <>
                <Wand2 size={18} /> Generate Campaign Structure & Perks
              </>
            )}
          </button>

          {/* Output Preview */}
          {generatedData && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Check size={14} /> Generated Blueprint Ready
                </span>
                <span className="text-xs px-2.5 py-1 bg-white dark:bg-gray-800 rounded-full font-semibold text-gray-600 dark:text-gray-300 shadow-xs">
                  Category: {generatedData.category}
                </span>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Generated Title:</div>
                <div className="text-sm font-extrabold text-gray-900 dark:text-white">{generatedData.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="text-gray-400 font-bold">Suggested Goal</div>
                  <div className="text-base font-black text-primary mt-0.5">{generatedData.funding_goal.toLocaleString()} Credits</div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="text-gray-400 font-bold">Reward Tiers Included</div>
                  <div className="text-base font-black text-secondary mt-0.5">{generatedData.rewards.length} Structured Tiers</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 font-bold uppercase mb-1">Story Preview:</div>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  {generatedData.story.replace(/#/g, '')}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Modal Footer */}
        {generatedData && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-extrabold shadow-md shadow-primary/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              Apply to Campaign Form <ArrowRight size={16} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
