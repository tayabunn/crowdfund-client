"use client";
import Link from 'next/link';

export default function ExploreCampaigns() {
  // Dummy data for now. Will be fetched from API later.
  const campaigns = [
    {
      id: "1",
      title: "Help us build a solar-powered water pump",
      creator_name: "Tech for Good",
      deadline: "2026-12-31",
      funding_goal: 50000,
      amount_raised: 25000,
      image_url: "https://via.placeholder.com/400x300",
      category: "Technology"
    },
    {
      id: "2",
      title: "Community Art Center Renovation",
      creator_name: "Local Artists United",
      deadline: "2026-10-15",
      funding_goal: 15000,
      amount_raised: 12000,
      image_url: "https://via.placeholder.com/400x300",
      category: "Art"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-dark mb-4">Explore Campaigns</h1>
          <p className="text-xl text-gray-500">Discover and support projects that matter to you.</p>
        </div>

        {/* Filter/Search Bar (Placeholder) */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Categories</option>
            <option>Technology</option>
            <option>Art</option>
            <option>Community</option>
            <option>Health</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
              <div className="h-48 relative">
                <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold text-primary rounded-md shadow-sm">
                  {campaign.category}
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-dark mb-2 line-clamp-2">{campaign.title}</h3>
                <p className="text-gray-500 text-sm mb-4">By {campaign.creator_name}</p>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-bold text-dark">${campaign.amount_raised} raised</span>
                    <span className="text-gray-500">of ${campaign.funding_goal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${(campaign.amount_raised / campaign.funding_goal) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="text-gray-500">{new Date(campaign.deadline).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/explore/${campaign.id}`} className="block w-full text-center bg-primary text-white py-2 rounded-md font-semibold hover:bg-primary-dark transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
