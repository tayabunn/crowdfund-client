"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';

type Contribution = {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  creator_name: string;
  contribution_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export default function SupporterHome() {
  const { user, token } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/contributions/my-contributions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setContributions(res.data);
      } catch (err) {
        console.error('Error fetching contributions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [token]);

  const totalContributions = contributions.length;
  const pendingContributions = contributions.filter(c => c.status === 'pending').length;
  const totalAmount = contributions
    .filter(c => c.status === 'approved')
    .reduce((sum, c) => sum + c.contribution_amount, 0);

  if (loading) {
    return <div className="text-center py-10">Loading overview data...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 font-sans">Supporter Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Contributions</h3>
          <p className="text-3xl font-extrabold text-gray-800 mt-2">{totalContributions}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Pending Contributions</h3>
          <p className="text-3xl font-extrabold text-yellow-500 mt-2">{pendingContributions}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Amount Contributed</h3>
          <p className="text-3xl font-extrabold text-primary mt-2">{totalAmount} Credits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Approved Contributions Table (Col-span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Approved Contributions</h3>
          </div>
          <div className="p-6">
            {contributions.filter(c => c.status === 'approved').length === 0 ? (
              <p className="text-gray-500 text-center py-6">No approved contributions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Creator</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {contributions.filter(c => c.status === 'approved').map((c) => (
                      <tr key={c._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          <Link href={`/explore/${c.campaign_id}`} className="hover:text-primary hover:underline transition-colors">
                            {c.campaign_title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{c.contribution_amount} Credits</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.creator_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Credit Packages Table (Col-span 1) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif">Credit Packages</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-800 text-left font-sans">
                <thead>
                  <tr className="bg-[#2e599b] text-white">
                    <th className="border border-gray-800 px-4 py-2.5 text-sm font-bold uppercase tracking-wider">Credits</th>
                    <th className="border border-gray-800 px-4 py-2.5 text-sm font-bold uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-800 px-4 py-3 text-sm text-gray-850 font-medium">100 credits</td>
                    <td className="border border-gray-800 px-4 py-3 text-sm text-gray-850 font-medium">$10</td>
                  </tr>
                  <tr className="bg-blue-50/10 hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-800 px-4 py-3 text-sm text-gray-850 font-medium">300 credits</td>
                    <td className="border border-gray-800 px-4 py-3 text-sm text-gray-850 font-medium">$25</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-800 px-4 py-3 text-sm text-gray-850 font-medium">800 credits</td>
                    <td className="border border-gray-800 px-4 py-3 text-sm text-gray-850 font-medium">$60</td>
                  </tr>
                  <tr className="bg-blue-50/10 hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-800 px-4 py-3 text-sm text-gray-850 font-medium">1500 credits</td>
                    <td className="border border-gray-800 px-4 py-3 text-sm text-gray-850 font-medium">$110</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link 
              href="/dashboard/purchase-credit" 
              className="inline-block w-full px-5 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              Purchase Credits Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
