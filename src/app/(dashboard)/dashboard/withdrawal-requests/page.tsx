"use client";
import { useAuth } from '@/context/AuthContext';
import { CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type WithdrawalRequest = {
  _id: string;
  creator_name: string;
  creator_email: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: string;
  account_number: string;
  status: 'pending' | 'approved';
  createdAt: string;
};

export default function WithdrawalRequests() {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPendingRequests = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/withdrawals/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err: any) {
      console.error('Error fetching withdrawal requests:', err);
      toast.error('Failed to load withdrawal requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'Admin') {
      fetchPendingRequests();
    }
  }, [token, user]);

  const handleApprove = async (id: string) => {
    if (!token) return;
    setProcessingId(id);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/withdrawals/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Withdrawal request approved and processed successfully!');
      // Remove approved item from list
      setRequests(prev => prev.filter(req => req._id !== id));
    } catch (err: any) {
      console.error('Error approving withdrawal:', err);
      toast.error(err.response?.data?.message || 'Failed to approve withdrawal request.');
    } finally {
      setProcessingId(null);
    }
  };

  if (user?.role !== 'Admin') return <div className="p-6 text-red-500 font-bold">Unauthorized. Admins only.</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Withdrawal Requests</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage and process pending creator withdrawal payouts</p>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading withdrawal requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center space-y-2">
            <CheckCircle size={40} className="text-green-500" />
            <p className="font-semibold text-lg text-gray-800">All caught up!</p>
            <p className="text-sm text-gray-400">There are no pending withdrawal requests to process.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Creator</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount ($)</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div>
                        <div className="font-semibold text-gray-800">{request.creator_name}</div>
                        <div className="text-xs text-gray-400 font-medium">{request.creator_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {request.withdrawal_credit} Credits
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-bold">
                      ${request.withdrawal_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium capitalize">
                      {request.payment_system}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {request.account_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-100 text-yellow-800 uppercase tracking-wide">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={processingId !== null}
                        className="flex items-center text-green-700 hover:text-white bg-green-50 hover:bg-green-600 border border-green-200 hover:border-green-600 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-xs shadow-sm"
                        title="Approve Payment"
                      >
                        <CheckCircle size={14} className="mr-1.5" />
                        {processingId === request._id ? 'Processing...' : 'Payment Success'}
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
  );
}
