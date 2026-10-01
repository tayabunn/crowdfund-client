"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { Heart, ArrowRight, Clock, Target, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SavedCampaignsPage() {
  const { token, user } = useAuth();
  const [savedCampaigns, setSavedCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/bookmarks/my-saved`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedCampaigns(res.data);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [token]);

  const handleRemove = async (campaignId: string) => {
    if (!token) return;
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${campaignId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedCampaigns(prev => prev.filter(c => c._id !== campaignId));
      toast.success('Removed from Watchlist');
    } catch (err) {
      toast.error('Could not remove bookmark');
    }
  };

  if (loading) {
    return <div className="text-center py-10 font-bold text-gray-500">Loading your saved watchlist...</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="text-red-500 fill-red-500" size={26} /> My Watchlist & Saved Projects
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Keep track of inspiring campaigns you want to back or follow.
          </p>
        </div>
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
          {savedCampaigns.length} Saved
        </span>
      </div>

      {savedCampaigns.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center mx-auto">
            <Heart size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Your Watchlist is empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Browse creative campaigns in the explore gallery and tap the heart icon to save projects here.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold shadow-md shadow-primary/20 transition-all"
          >
            Explore Projects <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCampaigns.map((camp) => (
            <div 
              key={camp._id}
              className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xs border border-gray-100 dark:border-gray-800 flex flex-col justify-between group hover:shadow-lg transition-all"
            >
              <div>
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={camp.image_url || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80"}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemove(camp._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 text-red-500 hover:scale-110 shadow-sm transition-all"
                    title="Remove from Watchlist"
                  >
                    <Trash2 size={15} />
                  </button>
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {camp.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white line-clamp-1">{camp.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{camp.story?.replace(/#/g, '')}</p>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      <span>{(camp.amount_raised || 0).toLocaleString()} Credits</span>
                      <span className="text-primary">{Math.min(Math.round(((camp.amount_raised || 0) / (camp.funding_goal || 1)) * 100), 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${Math.min(Math.round(((camp.amount_raised || 0) / (camp.funding_goal || 1)) * 100), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/explore/${camp._id}`}
                  className="w-full py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-800 dark:text-gray-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  View & Back Project <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
