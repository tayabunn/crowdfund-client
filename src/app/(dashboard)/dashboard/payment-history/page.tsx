"use client";
import { useAuth } from '@/context/AuthContext';
import { DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type WithdrawalType = {
  _id: string;
  withdrawal_credit: number;
  withdrawal_amount: number;
  payment_system: string;
  account_number: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export default function PaymentHistory() {
  const { user, token } = useAuth();
  const [history, setHistory] = useState<WithdrawalType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token || user?.role !== 'Creator') {
        setLoading(false);
        return;
      }
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/withdrawals/history`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          const approvedHistory = res.data.filter((w: WithdrawalType) => w.status === 'approved');
          setHistory(approvedHistory);
        } catch (err: any) {
        console.error('Error fetching payment history:', err);
        toast.error('Failed to load payment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, user]);

  if (!user || (user.role !== 'Supporter' && user.role !== 'Creator')) {
    return <div className="p-6 text-red-500 font-bold">Unauthorized</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
        <DollarSign className="text-gray-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-6 text-gray-500 font-medium">Loading payment history...</div>
        ) : user.role === 'Supporter' ? (
          // Supporters see static/dummy history or empty if not purchased
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount ($)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-07-01</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Credit Purchase</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">$25.00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">300</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                      Success
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2026-06-15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Credit Purchase</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">$10.00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                      Success
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No withdrawal payments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount ($)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment System</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {history.map((h) => (
                  <tr key={h._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Withdrawal</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">${h.withdrawal_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.withdrawal_credit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize font-medium">{h.payment_system}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        h.status === 'approved' ? 'bg-green-100 text-green-800' :
                        h.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {h.status === 'approved' ? 'Success' : h.status.charAt(0).toUpperCase() + h.status.slice(1)}
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
