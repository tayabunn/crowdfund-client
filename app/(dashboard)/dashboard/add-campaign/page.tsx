"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Upload } from 'lucide-react';

export default function AddCampaign() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    category: 'Technology',
    funding_goal: '',
    minimum_contribution: '',
    deadline: '',
    reward_info: '',
    image_url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API
  };

  if (user?.role !== 'Creator') {
    return <div className="p-6 text-red-500 font-bold">Unauthorized. Creators only.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Launch a New Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
          <input 
            type="text" 
            required 
            placeholder="e.g., Help us build a solar-powered water pump"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Story</label>
          <textarea 
            required 
            rows={5}
            placeholder="Tell supporters why they should fund your project..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.story}
            onChange={(e) => setFormData({...formData, story: e.target.value})}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Community">Community</option>
              <option value="Health">Health</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input 
              type="date" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal (Credits)</label>
            <input 
              type="number" 
              required 
              min="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.funding_goal}
              onChange={(e) => setFormData({...formData, funding_goal: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Contribution</label>
            <input 
              type="number" 
              required 
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.minimum_contribution}
              onChange={(e) => setFormData({...formData, minimum_contribution: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reward Information</label>
          <input 
            type="text" 
            required 
            placeholder="What do supporters receive for pledging?"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.reward_info}
            onChange={(e) => setFormData({...formData, reward_info: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                  <span>Upload a file</span>
                  <input type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-md hover:bg-primary-dark transition-colors"
          >
            Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
}
