"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Contribution = {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  creator_name: string;
  contribution_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export default function MyContributions() {
  const { user, token } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContributions, setTotalContributions] = useState(0);
  const limit = 5;

  const fetchContributions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/contributions/my-contributions?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setContributions(res.data.contributions);
      setTotalPages(res.data.totalPages || 1);
      setTotalContributions(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching contributions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, [token, page]);

  if (user?.role !== 'Supporter') return <div className="p-6 text-red-500 font-bold">Unauthorized. Supporters only.</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800 font-sans">My Contributions</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-sans">Track and manage your campaign donation history</p>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium font-sans">Loading contributions...</div>
        ) : contributions.length === 0 ? (
          <p className="text-gray-500 text-center py-12 font-sans">You haven't made any contributions yet.</p>
        ) : (
          <div className="space-y-5">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Creator</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {contributions.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 font-sans">
                        <Link href={`/explore/${c.campaign_id}`} className="text-primary hover:underline transition-colors font-bold">
                          {c.campaign_title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium font-sans">{c.creator_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold font-sans">{c.contribution_amount.toLocaleString()} Credits</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-sans">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider ${
                          c.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 font-sans">
                <div className="text-xs text-gray-400 font-medium">
                  Showing <span className="font-bold text-gray-700">{((page - 1) * limit) + 1}</span> to{" "}
                  <span className="font-bold text-gray-700">{Math.min(page * limit, totalContributions)}</span> of{" "}
                  <span className="font-bold text-gray-700">{totalContributions}</span> contributions
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 cursor-pointer flex items-center justify-center bg-white"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-gray-700 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 cursor-pointer flex items-center justify-center bg-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
