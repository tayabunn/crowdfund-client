export default function AdminHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Supporters</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,250</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Creators</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">340</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Credits</h3>
          <p className="text-3xl font-bold text-primary mt-2">1,500,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Payments Processed</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">$75,000</p>
        </div>
      </div>
    </div>
  );
}
