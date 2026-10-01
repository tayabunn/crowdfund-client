"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { X, Eye, PlusCircle, TrendingUp, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, Cell 
} from 'recharts';

type Campaign = {
  _id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  deadline: string;
  amount_raised: number;
  funding_goal: number;
  category: string;
  rewards?: any[];
};

type Contribution = {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  supporter_name: string;
  supporter_email: string;
  contribution_amount: number;
  status: string;
  message?: string;
  reward_title?: string;
  createdAt?: string;
};

const COLORS = ['#02a95c', '#ffc107', '#3b82f6', '#ec4899', '#8b5cf6'];

export default function CreatorHome() {
  const { user, token } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pendingContributions, setPendingContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCampaigns = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/creator`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCampaigns(res.data);
    } catch (err) {
      console.error('Error fetching creator campaigns:', err);
    }
  };

  const fetchPendingContributions = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/contributions/pending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingContributions(res.data);
    } catch (err) {
      console.error('Error fetching pending contributions:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCampaigns(), fetchPendingContributions()]);
      setLoading(false);
    };
    loadData();
  }, [token]);

  const handleProcessContribution = async (id: string, status: 'approved' | 'rejected') => {
    if (!token) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/contributions/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Contribution ${status} successfully!`);
      await Promise.all([fetchCampaigns(), fetchPendingContributions()]);
    } catch (err) {
      console.error('Error processing contribution:', err);
      toast.error('Failed to update contribution status.');
    }
  };

  // Stats calculation
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => new Date(c.deadline) > new Date()).length;
  const totalRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised || 0), 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + (c.funding_goal || 0), 0);

  // Chart data
  const chartData = campaigns.slice(0, 6).map((c, idx) => ({
    name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
    raised: c.amount_raised || 0,
    goal: c.funding_goal || 1000
  }));

  if (loading) {
    return <div className="text-center py-10 font-bold text-gray-500">Loading creator overview...</div>;
  }

  return (
    <div className="space-y-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Creator Dashboard & Analytics</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Track funding velocity, campaign health, and review backer contributions.</p>
        </div>
        <Link
          href="/dashboard/add-campaign"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-2xl shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <PlusCircle size={16} /> New Campaign
        </Link>
      </div>
      
      {/* 3 Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Campaigns</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-500">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-3">{totalCampaigns}</p>
          <p className="text-xs text-emerald-500 font-bold mt-1">{activeCampaigns} currently active</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Credits Raised</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-primary">
              <Award size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-primary mt-3">{totalRaised.toLocaleString()}</p>
          <p className="text-xs text-gray-400 font-semibold mt-1">Goal Target: {totalGoal.toLocaleString()} Credits</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Payout</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-500">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-secondary mt-3">${(totalRaised / 10).toFixed(2)}</p>
          <Link href="/dashboard/withdrawals" className="inline-flex items-center text-xs font-bold text-primary hover:underline mt-1">
            Request Payout <ArrowUpRight size={13} className="ml-0.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Analytics Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Campaign Funding Distribution</h3>
              <p className="text-xs text-gray-400">Comparing credits raised versus target goals</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                />
                <Bar dataKey="raised" fill="#02a95c" radius={[8, 8, 0, 0]} name="Credits Raised" />
                <Bar dataKey="goal" fill="#9ca3af" radius={[8, 8, 0, 0]} opacity={0.4} name="Target Goal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Contributions Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex justify-between items-center">
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Pending Backer Contributions</h3>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            {pendingContributions.length} Pending
          </span>
        </div>
        
        <div className="p-6">
          {pendingContributions.length === 0 ? (
            <p className="text-gray-400 text-center py-8 text-xs sm:text-sm">No pending backer contributions to review right now.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800 text-left text-xs">
                <thead>
                  <tr className="text-gray-400 uppercase font-bold tracking-wider">
                    <th className="px-4 py-3">Supporter</th>
                    <th className="px-4 py-3">Campaign</th>
                    <th className="px-4 py-3">Pledge Amount</th>
                    <th className="px-4 py-3">Reward Tier</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {pendingContributions.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white">
                        {c.supporter_name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        <Link href={`/explore/${c.campaign_id}`} className="hover:text-primary hover:underline">
                          {c.campaign_title}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 font-black text-primary">
                        {c.contribution_amount} Credits
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {c.reward_title || 'Standard Pledge'}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedContribution(c);
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg font-bold"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleProcessContribution(c._id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleProcessContribution(c._id, 'rejected')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {isModalOpen && selectedContribution && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Contribution Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase">Supporter:</span>
                <div className="font-extrabold text-gray-900 dark:text-white text-sm">{selectedContribution.supporter_name} ({selectedContribution.supporter_email})</div>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase">Campaign:</span>
                <div className="font-bold text-gray-800 dark:text-gray-200">{selectedContribution.campaign_title}</div>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase">Contribution Amount:</span>
                <div className="text-lg font-black text-primary">{selectedContribution.contribution_amount} Credits</div>
              </div>
              {selectedContribution.reward_title && (
                <div>
                  <span className="text-gray-400 font-bold uppercase">Selected Reward Perk:</span>
                  <div className="font-bold text-secondary">{selectedContribution.reward_title}</div>
                </div>
              )}
              {selectedContribution.message && (
                <div>
                  <span className="text-gray-400 font-bold uppercase">Backer Note:</span>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mt-1 text-gray-700 dark:text-gray-300">{selectedContribution.message}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => {
                  handleProcessContribution(selectedContribution._id, 'approved');
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleProcessContribution(selectedContribution._id, 'rejected');
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
