"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { X, Eye } from 'lucide-react';

type Campaign = {
  _id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  deadline: string;
  amount_raised: number;
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
  createdAt?: string;
};

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
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success(`Contribution ${status} successfully!`);
      // Refresh lists
      await Promise.all([fetchCampaigns(), fetchPendingContributions()]);
    } catch (err) {
      console.error('Error processing contribution:', err);
      toast.error('Failed to update contribution status.');
    }
  };

  // Stats calculation
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(
    c => new Date(c.deadline) > new Date()
  ).length;
  const totalRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised || 0), 0);

  if (loading) {
    return <div className="text-center py-10">Loading creator overview...</div>;
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Creator Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Campaigns</h3>
          <p className="text-3xl font-extrabold text-gray-800 mt-2">{totalCampaigns}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Active Campaigns</h3>
          <p className="text-3xl font-extrabold text-green-500 mt-2">{activeCampaigns}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Amount Raised</h3>
          <p className="text-3xl font-extrabold text-primary mt-2">{totalRaised} Credits</p>
          <p className="text-sm font-bold text-green-500 mt-1">Withdrawal Value: ${(totalRaised / 20).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800">Contributions to Review</h3>
        </div>
        <div className="p-6">
          {pendingContributions.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No contributions pending review.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supporter_name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">campaign_title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contribution_amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">View Contribution Button</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {pendingContributions.map((c) => (
                    <tr key={c._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {c.supporter_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/explore/${c.campaign_id}`} className="hover:text-primary hover:underline transition-colors">
                          {c.campaign_title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{c.contribution_amount} Credits</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedContribution(c);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center text-primary hover:text-primary-dark font-bold text-xs bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-all"
                        >
                          <Eye size={14} className="mr-1" /> View Details
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleProcessContribution(c._id, 'approved')}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-xl transition-colors font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleProcessContribution(c._id, 'rejected')}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Contribution Modal */}
      {isModalOpen && selectedContribution && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedContribution(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Contribution Details</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Supporter Name</span>
                <span className="text-base text-gray-900 font-semibold">{selectedContribution.supporter_name}</span>
                <span className="block text-xs text-gray-500 mt-0.5">({selectedContribution.supporter_email})</span>
              </div>
              
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Campaign Title</span>
                <span className="text-base text-gray-900 font-semibold">{selectedContribution.campaign_title}</span>
              </div>
              
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contribution Amount</span>
                <span className="text-lg font-bold text-primary">{selectedContribution.contribution_amount} Credits</span>
              </div>
              
              <div>
                <span className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Support Message</span>
                <p className="text-sm text-gray-800 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 whitespace-pre-wrap leading-relaxed">
                  {selectedContribution.message || "No message left by supporter."}
                </p>
              </div>

              {selectedContribution.createdAt && (
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date Contributed</span>
                  <span className="text-xs text-gray-600">
                    {new Date(selectedContribution.createdAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  handleProcessContribution(selectedContribution._id, 'approved');
                  setIsModalOpen(false);
                  setSelectedContribution(null);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-sm"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleProcessContribution(selectedContribution._id, 'rejected');
                  setIsModalOpen(false);
                  setSelectedContribution(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-colors text-sm shadow-sm"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedContribution(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
