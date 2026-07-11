"use client";
import { useAuth } from '@/context/AuthContext';
import { DollarSign } from 'lucide-react';

export default function PaymentHistory() {
  const { user } = useAuth();
  
  if (!user || (user.role !== 'Supporter' && user.role !== 'Creator')) {
    return <div className="p-6 text-red-500">Unauthorized</div>;
  }

  // Dummy data based on role
  const history = user.role === 'Supporter' ? [
    { id: '1', date: '2026-07-01', type: 'Credit Purchase', amount_dollars: 25, credits: 300, status: 'Success' },
    { id: '2', date: '2026-06-15', type: 'Credit Purchase', amount_dollars: 10, credits: 100, status: 'Success' },
  ] : [
    { id: '1', date: '2026-07-05', type: 'Withdrawal', amount_dollars: 50, credits: 1000, status: 'Processed' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
        <DollarSign className="text-gray-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount ($)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((h) => (
                <tr key={h.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{h.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${h.amount_dollars}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.credits}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {h.status}
                    </span>
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
