"use client";
import { useAuth } from '@/context/AuthContext';
import { CheckCircle } from 'lucide-react';

export default function WithdrawalRequests() {
  const { user } = useAuth();
  
  if (user?.role !== 'Admin') return <div className="p-6 text-red-500">Unauthorized</div>;

  // Dummy data
  const requests = [
    {
      id: '1',
      creator_name: 'Tech for Good',
      withdrawal_amount: 150, // dollars
      payment_system: 'Stripe',
      account_number: 'stripe_acc_123',
      status: 'pending'
    },
    {
      id: '2',
      creator_name: 'Local Artists United',
      withdrawal_amount: 25,
      payment_system: 'Bkash',
      account_number: '01711111111',
      status: 'pending'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Withdrawal Requests</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount ($)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.creator_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">${request.withdrawal_amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.payment_system}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.account_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="flex items-center text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded" title="Approve Payment">
                      <CheckCircle size={16} className="mr-1" />
                      Payment Success
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
