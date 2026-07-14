import React from 'react';
import Link from 'next/link';
import { Quote, Sparkles } from 'lucide-react';

export default function CreatorSpotlight() {
  return (
    <section className="py-20 bg-gray-50/50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Image card with accent overlays */}
          <div className="lg:w-1/2 w-full relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-3xl -z-10 blur-xl" />
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-secondary/10 rounded-3xl -z-10 blur-xl" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-white">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" 
                alt="Elena Rostova in her greenhouse" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
                <span className="text-sm font-bold tracking-wider uppercase">Active Creator Story</span>
              </div>
            </div>
          </div>

          {/* Right: Creator Quote and Stats */}
          <div className="lg:w-1/2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles size={14} /> Creator Spotlight
            </div>
            
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Elena Rostova & The Smart Greenhouse Initiative
            </h2>

            <div className="relative mb-8">
              <Quote className="absolute -top-4 -left-6 text-primary/15" size={48} />
              <p className="text-lg text-gray-600 italic leading-relaxed relative z-10 pl-2">
                "Raising credits on Crowdfund allowed us to procure advanced automated sensors and bring smart hydroponics to three local schools. The transparency and ease of the platform built immediate trust with our community backers."
              </p>
            </div>

            {/* Micro stats grid */}
            <div className="grid grid-cols-3 gap-6 border-y border-gray-200/60 py-6 mb-8">
              <div>
                <div className="text-2xl font-black text-gray-900">12,500</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Credits Goal</div>
              </div>
              <div>
                <div className="text-2xl font-black text-primary">15,000</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Credits Raised</div>
              </div>
              <div>
                <div className="text-2xl font-black text-secondary">120%</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Percent Funded</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link 
                href="/explore/6a537704b1d2bd2e37d8ee34" 
                className="bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 px-8 rounded-2xl text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                View Her Campaign
              </Link>
              <Link 
                href="/register" 
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-extrabold py-3.5 px-8 rounded-2xl text-base transition-all"
              >
                Start Your Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
