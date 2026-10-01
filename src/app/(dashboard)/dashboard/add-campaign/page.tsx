"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Upload, Sparkles, Plus, Trash2, Gift, Target, Info, Check } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AiCampaignModal from '@/components/AiCampaignModal';

interface RewardTier {
  title: string;
  description: string;
  amount: number;
  estimated_delivery: string;
  items: string[];
  max_slots?: number;
}

interface StretchGoal {
  amount: number;
  title: string;
  description: string;
}

export default function AddCampaign() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    story: '',
    category: 'Technology',
    funding_goal: '',
    minimum_contribution: '',
    deadline: '',
    reward_info: '',
    image_url: '',
    funding_type: 'flexible' as 'flexible' | 'fixed',
  });

  const [rewards, setRewards] = useState<RewardTier[]>([
    {
      title: 'Early Bird Perk',
      description: 'Exclusive project backer certificate and digital acknowledgment.',
      amount: 250,
      estimated_delivery: 'Within 2 months',
      items: ['Digital Backer Certificate', 'Supporter Badge']
    }
  ]);

  const [stretchGoals, setStretchGoals] = useState<StretchGoal[]>([
    {
      amount: 15000,
      title: 'Bonus Feature Milestone',
      description: 'Unlocks extended functionality and bonus updates for all backers.'
    }
  ]);

  // Handle AI generator apply
  const handleAiApply = (aiData: any) => {
    setFormData({
      title: aiData.title,
      story: aiData.story,
      category: aiData.category,
      funding_goal: String(aiData.funding_goal),
      minimum_contribution: String(aiData.minimum_contribution),
      deadline: formData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reward_info: aiData.reward_info,
      image_url: formData.image_url,
      funding_type: aiData.funding_type || 'flexible'
    });
    if (aiData.rewards && aiData.rewards.length > 0) {
      setRewards(aiData.rewards);
    }
    if (aiData.stretch_goals && aiData.stretch_goals.length > 0) {
      setStretchGoals(aiData.stretch_goals);
    }
    toast.success('AI Campaign blueprint applied successfully!');
  };

  const handleAddReward = () => {
    setRewards([
      ...rewards,
      {
        title: '',
        description: '',
        amount: 500,
        estimated_delivery: '',
        items: []
      }
    ]);
  };

  const handleRemoveReward = (index: number) => {
    setRewards(rewards.filter((_, idx) => idx !== index));
  };

  const handleUpdateReward = (index: number, field: keyof RewardTier, value: any) => {
    const updated = [...rewards];
    updated[index] = { ...updated[index], [field]: value };
    setRewards(updated);
  };

  const handleAddStretchGoal = () => {
    setStretchGoals([
      ...stretchGoals,
      {
        amount: Number(formData.funding_goal || 10000) * 1.5,
        title: '',
        description: ''
      }
    ]);
  };

  const handleRemoveStretchGoal = (index: number) => {
    setStretchGoals(stretchGoals.filter((_, idx) => idx !== index));
  };

  const handleUpdateStretchGoal = (index: number, field: keyof StretchGoal, value: any) => {
    const updated = [...stretchGoals];
    updated[index] = { ...updated[index], [field]: value };
    setStretchGoals(updated);
  };

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
      if (!apiKey) throw new Error('imgBB API key is missing.');
      
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        uploadData
      );
      const url = res.data.data.url;
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Cover image uploaded successfully to imgBB!');
    } catch (err: any) {
      console.error('Error uploading to imgBB:', err);
      toast.error('Failed to upload image. Please enter an image URL instead.');
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
          image_url: formData.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
          funding_type: formData.funding_type,
          rewards: rewards.filter(r => r.title.trim() && r.amount > 0),
          stretch_goals: stretchGoals.filter(g => g.title.trim() && g.amount > 0)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Campaign submitted for administrator review!');
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
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl shadow-xs border border-gray-100 dark:border-gray-800 transition-colors">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* AI Modal */}
      <AiCampaignModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={handleAiApply}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Launch a New Campaign</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Structure your project story, reward tiers, and funding milestones.</p>
        </div>
        
        {/* AI Generator Button */}
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-primary/20 hover:scale-105 transition-all text-sm cursor-pointer"
        >
          <Sparkles size={16} /> AI Campaign Co-Pilot
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 font-sans">
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-l-4 border-primary pl-3">1. Campaign Basics</h3>
          
          <div>
            <label htmlFor="campaign_title" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
              Campaign Title
            </label>
            <input 
              type="text" 
              required 
              id="campaign_title"
              name="campaign_title"
              placeholder="e.g. Next-Gen Portable Solar Purifier"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white text-sm font-semibold"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="campaign_story" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
              Campaign Story & Pitch
            </label>
            <textarea 
              required 
              rows={6}
              id="campaign_story"
              name="campaign_story"
              placeholder="Tell supporters why they should fund your project..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white text-sm"
              value={formData.story}
              onChange={(e) => setFormData({...formData, story: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                Category
              </label>
              <select 
                id="category"
                name="category"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white text-sm font-bold"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Community">Community</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Disaster Relief">Disaster Relief</option>
              </select>
            </div>

            <div>
              <label htmlFor="funding_type" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                Funding Model
              </label>
              <select 
                id="funding_type"
                name="funding_type"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white text-sm font-bold"
                value={formData.funding_type}
                onChange={(e) => setFormData({...formData, funding_type: e.target.value as any})}
              >
                <option value="flexible">Flexible Funding (Keep what you raise)</option>
                <option value="fixed">Fixed Funding (All or Nothing)</option>
              </select>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                Deadline
              </label>
              <input 
                type="date" 
                required 
                id="deadline"
                name="deadline"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white text-sm font-semibold"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="funding_goal" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                Funding Goal (Credits)
              </label>
              <input 
                type="number" 
                required 
                min="100"
                id="funding_goal"
                name="funding_goal"
                placeholder="e.g. 10000"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white text-sm font-semibold"
                value={formData.funding_goal}
                onChange={(e) => setFormData({...formData, funding_goal: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="minimum_Contribution" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                Minimum Contribution (Credits)
              </label>
              <input 
                type="number" 
                required 
                min="1"
                id="minimum_Contribution"
                name="minimum_Contribution"
                placeholder="e.g. 50"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white text-sm font-semibold"
                value={formData.minimum_contribution}
                onChange={(e) => setFormData({...formData, minimum_contribution: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label htmlFor="reward_info" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
              Reward Summary
            </label>
            <input 
              type="text" 
              required 
              id="reward_info"
              name="reward_info"
              placeholder="Summary of what backers receive"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white text-sm"
              value={formData.reward_info}
              onChange={(e) => setFormData({...formData, reward_info: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                Upload Cover Image
              </label>
              <label className="flex items-center justify-center px-4 py-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 cursor-pointer transition-colors w-full text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Upload className="w-4 h-4 mr-2 text-primary animate-bounce" />
                {uploadingImage ? 'Uploading to imgBB...' : 'Choose Image File'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div>
              <label htmlFor="campaign_image_url" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                Or Cover Image URL
              </label>
              <input 
                type="url" 
                id="campaign_image_url"
                name="campaign_image_url"
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white text-sm"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* 2. Structured Reward Tiers (Perks) */}
        <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-l-4 border-secondary pl-3 flex items-center gap-2">
              <Gift size={20} className="text-secondary" /> 2. Backer Reward Packages (Tiers)
            </h3>
            <button
              type="button"
              onClick={handleAddReward}
              className="px-3.5 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary hover:text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Tier
            </button>
          </div>

          <div className="space-y-4">
            {rewards.map((reward, index) => (
              <div key={index} className="p-5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4 relative">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tier #{index + 1}</span>
                  {rewards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveReward(index)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Remove Tier"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Tier Title</label>
                    <input
                      type="text"
                      placeholder="e.g. VIP Founder Edition"
                      value={reward.title}
                      onChange={(e) => handleUpdateReward(index, 'title', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Pledge Amount (Credits)</label>
                    <input
                      type="number"
                      min="10"
                      placeholder="500"
                      value={reward.amount}
                      onChange={(e) => handleUpdateReward(index, 'amount', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Perk Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe what's included in this tier..."
                    value={reward.description}
                    onChange={(e) => handleUpdateReward(index, 'description', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Stretch Goals */}
        <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-l-4 border-primary pl-3 flex items-center gap-2">
              <Target size={20} className="text-primary" /> 3. Milestone Stretch Goals
            </h3>
            <button
              type="button"
              onClick={handleAddStretchGoal}
              className="px-3.5 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Stretch Goal
            </button>
          </div>

          <div className="space-y-4">
            {stretchGoals.map((goal, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Milestone #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStretchGoal(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Target Credits</label>
                    <input
                      type="number"
                      value={goal.amount}
                      onChange={(e) => handleUpdateStretchGoal(index, 'amount', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Unlock Perk Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Mobile App Release"
                      value={goal.title}
                      onChange={(e) => handleUpdateStretchGoal(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
          <button 
            type="submit" 
            disabled={submitting || uploadingImage}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all text-base disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Submitting Campaign...' : 'Submit Campaign for Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
