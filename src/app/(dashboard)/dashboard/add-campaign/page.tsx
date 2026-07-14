"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddCampaign() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error('imgBB API key is missing.');
      }
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        uploadData
      );
      const url = res.data.data.url;
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Image uploaded successfully to imgBB!');
    } catch (err: any) {
      console.error('Error uploading to imgBB:', err);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in to create a campaign.');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns`,
        {
          title: formData.title,
          story: formData.story,
          category: formData.category,
          funding_goal: Number(formData.funding_goal),
          minimum_contribution: Number(formData.minimum_contribution),
          deadline: formData.deadline,
          reward_info: formData.reward_info,
          image_url: formData.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Campaign submitted for approval successfully!');
      setTimeout(() => {
        router.push('/dashboard/my-campaigns');
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit campaign.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== 'Creator') {
    return <div className="p-6 text-red-500 font-bold">Unauthorized. Creators only.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Launch a New Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="campaign_title" className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
          <input 
            type="text" 
            required 
            id="campaign_title"
            name="campaign_title"
            placeholder="e.g., Help us build a solar-powered water pump"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="campaign_story" className="block text-sm font-medium text-gray-700 mb-1">Campaign Story</label>
          <textarea 
            required 
            rows={5}
            id="campaign_story"
            name="campaign_story"
            placeholder="Tell supporters why they should fund your project..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.story}
            onChange={(e) => setFormData({...formData, story: e.target.value})}
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              id="category"
              name="category"
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
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input 
              type="date" 
              required 
              id="deadline"
              name="deadline"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.deadline}
              onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="funding_goal" className="block text-sm font-medium text-gray-700 mb-1">Funding Goal (Credits)</label>
            <input 
              type="number" 
              required 
              min="100"
              id="funding_goal"
              name="funding_goal"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.funding_goal}
              onChange={(e) => setFormData({...formData, funding_goal: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="minimum_Contribution" className="block text-sm font-medium text-gray-700 mb-1">Minimum Contribution</label>
            <input 
              type="number" 
              required 
              min="1"
              id="minimum_Contribution"
              name="minimum_Contribution"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.minimum_contribution}
              onChange={(e) => setFormData({...formData, minimum_contribution: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reward_info" className="block text-sm font-medium text-gray-700 mb-1">Reward Information</label>
          <input 
            type="text" 
            required 
            id="reward_info"
            name="reward_info"
            placeholder="What do supporters receive for pledging?"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.reward_info}
            onChange={(e) => setFormData({...formData, reward_info: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="campaign_image_file" className="block text-sm font-medium text-gray-700 mb-1">Upload Cover Image</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors w-full">
                <Upload className="w-4 h-4 mr-2 text-gray-500 animate-bounce" />
                {uploadingImage ? 'Uploading to imgBB...' : 'Choose Image File'}
                <input 
                  type="file" 
                  id="campaign_image_file"
                  accept="image/*" 
                  className="hidden" 
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="campaign_image_url" className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input 
              type="url" 
              id="campaign_image_url"
              name="campaign_image_url"
              placeholder="e.g., https://images.unsplash.com/photo-1542601906990-b4d3fb778b09"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={submitting || uploadingImage}
            className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}
