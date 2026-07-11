export default function SupporterHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Supporter Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Contributions</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pending Contributions</h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Amount Contributed</h3>
          <p className="text-3xl font-bold text-primary mt-2">350 Credits</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Approved Contributions</h3>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Solar Pump Project</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tech for Good</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">50 Credits</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500 font-semibold">Approved</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
