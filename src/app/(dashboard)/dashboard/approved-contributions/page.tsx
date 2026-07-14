"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Contribution = {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  creator_name: string;
  contribution_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export default function ApprovedContributions() {
  const { user, token } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedContributions = async () => {
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
        // Filter to display only approved contributions
        const approvedOnly = res.data.filter((c: Contribution) => c.status === 'approved');
        setContributions(approvedOnly);
      } catch (err: any) {
        console.error('Error fetching approved contributions:', err);
        toast.error('Failed to load approved contributions.');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedContributions();
  }, [token]);

  if (user?.role !== 'Supporter') {
    return <div className="p-6 text-red-500 font-bold">Unauthorized. Supporters only.</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Approved Contributions</h2>
          <p className="text-xs text-gray-500 mt-0.5">List of all your contributions that have been approved by creators</p>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading approved contributions...</div>
        ) : contributions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">You do not have any approved contributions yet.</div>
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
                {contributions.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      <Link href={`/explore/${c.campaign_id}`} className="hover:text-primary hover:underline transition-colors">
                        {c.campaign_title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      {c.contribution_amount} Credits
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {c.creator_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 uppercase tracking-wider">
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
  );
}
