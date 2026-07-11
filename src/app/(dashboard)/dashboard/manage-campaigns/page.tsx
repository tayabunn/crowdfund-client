"use client";
import { useAuth } from '@/context/AuthContext';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function ManageCampaigns() {
  const { user } = useAuth();
  
  if (user?.role !== 'Admin') return <div className="p-6 text-red-500">Unauthorized</div>;

  // Dummy data
  const campaigns = [
    {
      id: '1',
      title: 'Help us build a solar-powered water pump',
      creator_name: 'Tech for Good',
      funding_goal: 50000,
      status: 'pending'
    },
    {
      id: '2',
      title: 'Community Garden Initiative',
      creator_name: 'Local Artists United',
      funding_goal: 10000,
      status: 'approved'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Manage Campaigns</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.creator_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.funding_goal} Credits</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      campaign.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {campaign.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900" title="Approve">
                            <CheckCircle size={20} />
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Reject">
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                      <button className="text-gray-400 hover:text-red-600 ml-2" title="Delete">
                        <Trash2 size={20} />
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
