import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How do I start a campaign on Crowdfund?",
    answer: "Simply register as a Creator on our platform, navigate to your Creator Dashboard, and click 'Start a Campaign'. Fill in details such as the title, story, category, funding goal (in credits), deadline, and rewards, then submit it. The administrator will review and approve it shortly."
  },
  {
    question: "How do I contribute to a campaign?",
    answer: "Once logged in as a Supporter, you can navigate to the 'Explore' page to view all approved campaigns. Clicking on any project card takes you to its detail page. Here you can choose your contribution amount and click 'Contribute'. Your credits will be securely processed and added to the project."
  },
  {
    question: "What happens if a campaign fails to reach its goal?",
    answer: "All campaigns are subject to an all-or-nothing policy. If a campaign reaches its deadline date without meeting 100% of its target funding goal, all contributed credits are automatically returned/refunded to the supporters' account balances."
  },
  {
    question: "Are my transactions and personal details secure?",
    answer: "Security is our highest priority. All account operations, wallet balances, contributions, and personal details are encrypted and securely authenticated through jsonwebtoken signatures and server role verification. We do not store plain-text passwords or financial data."
  }
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle size={14} /> Help Center
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4"></div>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Find answers to common questions about starting and funding projects on Crowdfund.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                >
                  <span className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-gray-400 ${isOpen ? 'text-primary' : ''}`}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
