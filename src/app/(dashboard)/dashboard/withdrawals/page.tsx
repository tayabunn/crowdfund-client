"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
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

export default function Withdrawals() {
  const { token, user, updateUser } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [withdrawalCredit, setWithdrawalCredit] = useState('');
  const [paymentSystem, setPaymentSystem] = useState('stripe');
  const [accountNumber, setAccountNumber] = useState('');

  const fetchData = async () => {
    if (!token) return;
    try {
      const [campaignsRes, withdrawalsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/creator`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/withdrawals/history`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setCampaigns(campaignsRes.data);
      setWithdrawals(withdrawalsRes.data);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load earnings or withdrawal history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  if (user?.role !== 'Creator') {
    return <div className="p-6 text-red-500 font-bold">Unauthorized. Creators only.</div>;
  }

  const totalRaised = campaigns.reduce((sum, camp) => sum + (camp.amount_raised || 0), 0);
  const totalWithdrawnOrPending = withdrawals.reduce((sum, w) => sum + w.withdrawal_credit, 0);
  const availableToWithdraw = totalRaised - totalWithdrawnOrPending;
  const currentDollarAmount = (Number(withdrawalCredit) / 20) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const credits = Number(withdrawalCredit);
    if (isNaN(credits) || credits < 200) {
      toast.error('Minimum withdrawal amount is 200 credits.');
      return;
    }
    if (credits > availableToWithdraw) {
      toast.error('You do not have enough available credits to withdraw.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/withdrawals`,
        {
          withdrawal_credit: credits,
          payment_system: paymentSystem,
          account_number: accountNumber
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Withdrawal request submitted successfully!');
      setWithdrawalCredit('');
      setAccountNumber('');
      // Deduct client-side user credits in auth context
      if (user) {
        updateUser({
          ...user,
          credits: user.credits - credits
        });
      }
      // Append new request to local state
      setWithdrawals(prev => [res.data, ...prev]);
    } catch (err: any) {
      console.error('Error submitting withdrawal request:', err);
      toast.error(err.response?.data?.message || 'Failed to submit withdrawal request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-semibold">Loading earnings and account summary...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Withdrawal</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="withdraw_credits" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Credits to Withdraw
                    </label>
                    <input 
                      type="number" 
                      id="withdraw_credits"
                      required 
                      min="200"
                      max={availableToWithdraw}
                      placeholder="Enter credits (Min. 200)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm bg-gray-50/50 focus:bg-white transition-all outline-none"
                      value={withdrawalCredit}
                      onChange={(e) => setWithdrawalCredit(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      Available to withdraw: <span className="text-gray-800 font-bold">{availableToWithdraw} Credits</span>
                    </p>
                  </div>

                  <div>
                    <label htmlFor="equivalent_usd" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Withdrawal Amount ($)
                    </label>
                    <input 
                      type="text" 
                      id="equivalent_usd"
                      disabled
                      className="w-full px-4 py-3 border border-gray-100 bg-gray-50 rounded-2xl text-gray-500 font-bold sm:text-sm"
                      value={`$${currentDollarAmount.toFixed(2)}`}
                    />
                    <p className="text-xs text-gray-400 mt-1 font-semibold">Conversion rate: 20 Credits = $1</p>
                  </div>

                  <div>
                    <label htmlFor="payment_system" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Payment System
                    </label>
                    <select 
                      id="payment_system"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm bg-gray-50/50 focus:bg-white transition-all outline-none"
                      value={paymentSystem}
                      onChange={(e) => setPaymentSystem(e.target.value)}
                    >
                      <option value="stripe">Stripe</option>
                      <option value="bkash">bKash</option>
                      <option value="rocket">Rocket</option>
                      <option value="nagad">Nagad</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="account_details" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Account Number / Email
                    </label>
                    <input 
                      type="text" 
                      id="account_details"
                      required 
                      placeholder="e.g. email@example.com or active mobile number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm bg-gray-50/50 focus:bg-white transition-all outline-none"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>

                  {(availableToWithdraw < 200 || (withdrawalCredit !== '' && Number(withdrawalCredit) > availableToWithdraw)) ? (
                    <div className="text-red-500 font-bold text-center text-sm py-3 bg-red-50 rounded-2xl border border-red-100">
                      Insufficient credit
                    </div>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50"
                    >
                      {submitting ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  )}
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Earnings Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Total Raised</span>
                    <span className="font-bold text-gray-800">{totalRaised} Credits</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Total Withdrawn / Pending</span>
                    <span className="font-bold text-red-500">-{totalWithdrawnOrPending} Credits</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-800 font-bold">Available to Withdraw</span>
                    <span className={`text-lg font-extrabold ${availableToWithdraw >= 200 ? 'text-green-500' : 'text-gray-600'}`}>
                      {availableToWithdraw} Credits
                    </span>
                  </div>
                  <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/50 mt-4 text-xs leading-relaxed text-green-800 font-medium">
                    <span className="block font-extrabold mb-1">Conversion Details:</span>
                    Your campaigns raise funds at a rate of 10 credits per $1. However, creator payouts are completed at **20 credits per $1**. The remaining portion covers platform service operations.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800">Withdrawal History</h3>
            </div>
            <div className="p-6">
              {withdrawals.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No withdrawal requests found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits Requested</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Equivalent USD</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment System</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Account info</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {withdrawals.map((w) => (
                        <tr key={w._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(w.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {w.withdrawal_credit} Credits
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                            ${w.withdrawal_amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium capitalize">
                            {w.payment_system}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {w.account_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                              w.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              w.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
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
        </>
      )}
    </div>
  );
}
