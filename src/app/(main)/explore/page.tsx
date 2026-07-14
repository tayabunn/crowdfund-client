"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

type Campaign = {
  _id: string;
  title: string;
  creator_name: string;
  deadline: string;
  funding_goal: number;
  amount_raised: number;
  image_url: string;
  category: string;
};

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [minGoal, setMinGoal] = useState('');
  const [maxGoal, setMaxGoal] = useState('');
  const [deadline, setDeadline] = useState('active'); // 'active' | 'expired' | 'all'
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // Show 6 campaigns per page

  useEffect(() => {
    fetchCampaigns();
  }, [page, category, deadline, sortBy]);

  // Debounce search and goal inputs
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchCampaigns();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, minGoal, maxGoal]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, {
        params: {
          page,
          limit,
          search,
          category,
          minGoal: minGoal || undefined,
          maxGoal: maxGoal || undefined,
          deadline,
          sortBy
        }
      });
      setCampaigns(res.data.campaigns);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-sans">Explore Campaigns</h1>
          <p className="text-xl text-gray-500 font-sans">Discover and support projects that matter to you.</p>
        </motion.div>

        {/* Filter/Search Bar */}
        <motion.div 
          className="mb-10 bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4 font-sans"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Row 1: Search, Category & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Search Title</label>
              <input 
                type="text" 
                placeholder="Search campaigns..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-semibold text-gray-700 placeholder-gray-400"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
              <select 
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-bold text-gray-700 cursor-pointer"
              >
                <option>All Categories</option>
                <option>Technology</option>
                <option>Art</option>
                <option>Community</option>
                <option>Health</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-bold text-gray-700 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="goal_desc">Highest Goal First</option>
                <option value="goal_asc">Lowest Goal First</option>
              </select>
            </div>
          </div>

          {/* Row 2: Funding Goal Range & Deadline Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Min Goal (Credits)</label>
              <input 
                type="number" 
                placeholder="Min Credits" 
                value={minGoal}
                onChange={(e) => setMinGoal(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-semibold text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Max Goal (Credits)</label>
              <input 
                type="number" 
                placeholder="Max Credits" 
                value={maxGoal}
                onChange={(e) => setMaxGoal(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-semibold text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Campaign Expiry</label>
              <select 
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-bold text-gray-700 cursor-pointer"
              >
                <option value="active">Active Campaigns Only</option>
                <option value="expired">Expired Campaigns Only</option>
                <option value="all">All Campaigns</option>
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {campaigns.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg">No approved campaigns found matching your criteria.</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {campaigns.map((campaign) => (
                  <motion.div 
                    key={campaign._id} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-2xl transition-all group flex flex-col"
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                  >
                    <div className="h-56 relative overflow-hidden bg-gray-100">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img 
                        src={campaign.image_url || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80"} 
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80";
                        }}
                        alt={campaign.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-3 right-3 bg-white px-3 py-1 text-xs font-bold text-primary rounded-full shadow-sm z-20">
                        {campaign.category}
                      </span>
                    </div>
                    <div className="p-6 flex-grow flex flex-col font-sans">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
                      <p className="text-gray-500 text-sm mb-4">By {campaign.creator_name}</p>
                      
                      <div className="mt-auto space-y-4">
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden animate-pulse">
                          <motion.div 
                            className="bg-primary h-full rounded-full" 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min(((campaign.amount_raised || 0) / campaign.funding_goal) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>

                        <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-primary text-base">
                            Raised: {(campaign.amount_raised || 0).toLocaleString()} Credits
                          </span>
                          <span className="text-gray-500">
                            Goal: {campaign.funding_goal.toLocaleString()} Credits
                          </span>
                        </div>

                        <div className="text-xs text-red-500 font-bold bg-red-50 px-3 py-1.5 rounded-xl inline-block w-fit">
                          Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                        </div>

                        <Link href={`/explore/${campaign._id}`} className="block w-full text-center bg-gray-50 text-primary border border-primary/20 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
                    page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium ${
                      page === p
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
                    page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
