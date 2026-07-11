"use client";
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Ban, Trash2 } from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();
  
  if (user?.role !== 'Admin') return <div className="p-6 text-red-500">Unauthorized</div>;

  // Dummy data
  const reports = [
    {
      id: '1',
      reporter_name: 'Concerned Citizen',
      campaign_title: 'Fake Charity Project',
      reason: 'Creator has a history of scamming. Evidence provided.',
      date: '2026-07-10'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center text-red-600">
        <ShieldAlert className="mr-2" />
        <h2 className="text-xl font-bold">Suspicious Activity Reports</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.campaign_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reporter_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={report.reason}>{report.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 px-2 py-1 rounded flex items-center" title="Suspend Campaign">
                        <Ban size={16} className="mr-1" /> Suspend
                      </button>
                      <button className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded flex items-center" title="Delete Campaign">
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </div>
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
