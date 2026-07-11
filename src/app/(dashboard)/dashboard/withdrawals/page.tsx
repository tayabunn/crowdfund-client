"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Withdrawals() {
  const { user } = useAuth();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  
  if (user?.role !== 'Creator') return <div className="p-6 text-red-500">Unauthorized</div>;

  // Dummy values
  const totalRaised = 500; 
  const currentDollarAmount = (Number(withdrawalAmount) / 20) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Withdrawal</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credits to Withdraw</label>
              <input 
                type="number" 
                required 
                max={totalRaised}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Available to withdraw: {totalRaised} Credits</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Amount ($)</label>
              <input 
                type="text" 
                disabled
                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500"
                value={`$${currentDollarAmount.toFixed(2)}`}
              />
              <p className="text-xs text-gray-500 mt-1">Conversion rate: 20 Credits = $1</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment System</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="stripe">Stripe</option>
                <option value="bkash">Bkash</option>
                <option value="rocket">Rocket</option>
                <option value="nagad">Nagad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number / Email</label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {totalRaised >= 200 ? (
               <button 
                type="submit" 
                className="w-full py-3 bg-primary text-white font-bold rounded-md hover:bg-primary-dark transition-colors"
              >
                Submit Request
              </button>
            ) : (
              <button 
                disabled
                type="button" 
                className="w-full py-3 bg-gray-300 text-gray-500 font-bold rounded-md cursor-not-allowed"
              >
                Minimum 200 Credits Required
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Earnings Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Total Raised</span>
              <span className="font-bold text-gray-800">{totalRaised} Credits</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Equivalent Amount</span>
              <span className="font-bold text-primary">${(totalRaised / 20).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
