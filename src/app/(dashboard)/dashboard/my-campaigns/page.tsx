"use client";
import { useAuth } from '@/context/AuthContext';
import { Edit2, Trash2, X, TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/base-ui/alert-dialog';
import { Checkbox } from '@/components/base-ui/checkbox';
import { Label } from '@/components/base-ui/label';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type CampaignType = {
  _id: string;
  title: string;
  story: string;
  category: string;
  funding_goal: number;
  minimum_contribution: number;
  deadline: string;
  reward_info: string;
  image_url: string;
  amount_raised: number;
  status: 'pending' | 'approved' | 'rejected';
};

export default function MyCampaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    reward_info: ''
  });

  const [campaignToDelete, setCampaignToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleEditClick = (campaign: CampaignType) => {
    setSelectedCampaignId(campaign._id);
    setFormData({
      title: campaign.title,
      story: campaign.story || '',
      reward_info: campaign.reward_info || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) return;

    setUpdating(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${selectedCampaignId}`,
        {
          title: formData.title,
          story: formData.story,
          reward_info: formData.reward_info
        }
      );

      // Update campaigns state
      setCampaigns(prev => prev.map(c => c._id === selectedCampaignId ? res.data : c));
      toast.success('Campaign updated successfully!');
      setIsEditModalOpen(false);
      setSelectedCampaignId(null);
    } catch (err: any) {
      console.error('Error updating campaign:', err);
      toast.error(err.response?.data?.message || 'Failed to update campaign.');
    } finally {
      setUpdating(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/creator`);
      setCampaigns(res.data);
    } catch (err: any) {
      toast.error('Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'Creator') {
      fetchCampaigns();
    }
  }, [user]);

  if (user?.role !== 'Creator') {
    return <div className="p-6 text-red-500 font-bold">Unauthorized. Creators only.</div>;
  }

  const handleDeleteCampaign = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`);
      setCampaigns(prev => prev.filter(c => c._id !== id));
      toast.success('Campaign deleted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete campaign.');
    } finally {
      setCampaignToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">My Campaigns</h2>
        <Link href="/dashboard/add-campaign" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm font-medium">
          Create New
        </Link>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-6 text-gray-500 font-medium">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-6 text-gray-500">You have not created any campaigns yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/explore/${campaign._id}`} className="text-primary hover:underline font-semibold block text-sm transition-colors">
                        {campaign.title}
                      </Link>
                      <div className="text-xs text-gray-500 mt-0.5">Goal: {campaign.funding_goal} Credits</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1 max-w-[150px]">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, (campaign.amount_raised / campaign.funding_goal) * 100)}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{campaign.amount_raised} Raised</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditClick(campaign)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer outline-none"
                          title="Edit Campaign"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setCampaignToDelete({ id: campaign._id, title: campaign.title });
                            setIsConfirmed(false);
                          }}
                          className="text-red-600 hover:text-red-900 cursor-pointer" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Campaign Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCampaignId(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Edit Campaign</h3>

            <form onSubmit={handleUpdateCampaign} className="space-y-4">
              <div>
                <label htmlFor="edit_campaign_title" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  id="edit_campaign_title"
                  placeholder="e.g., Help us build a solar-powered water pump"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm bg-gray-50/50 focus:bg-white transition-all outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="edit_campaign_story" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Campaign Story</label>
                <textarea
                  required
                  rows={6}
                  id="edit_campaign_story"
                  placeholder="Tell supporters why they should fund your project..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm bg-gray-50/50 focus:bg-white transition-all outline-none"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label htmlFor="edit_reward_info" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Reward Information</label>
                <input
                  type="text"
                  required
                  id="edit_reward_info"
                  placeholder="What do supporters receive for pledging?"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm bg-gray-50/50 focus:bg-white transition-all outline-none"
                  value={formData.reward_info}
                  onChange={(e) => setFormData({ ...formData, reward_info: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-colors text-sm shadow-sm disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedCampaignId(null);
                  }}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Campaign Confirmation Alert Dialog */}
      <AlertDialog open={campaignToDelete !== null} onOpenChange={(open) => { if (!open) setCampaignToDelete(null); }}>
        <AlertDialogContent className="border border-gray-100 rounded-2xl bg-white p-7 shadow-xl max-w-md">
          <AlertDialogHeader className="place-items-start text-left">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-red-50">
              <TriangleAlertIcon className="size-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-gray-800">
              Delete campaign "{campaignToDelete?.title}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 mt-2">
              This action is permanent and cannot be undone. All associated campaign data
              will be removed forever.
              <span className="mt-5 flex items-center justify-start gap-3">
                <Checkbox
                  id="terms"
                  checked={isConfirmed}
                  onCheckedChange={(val) => setIsConfirmed(val)}
                  className="border-gray-300 rounded text-primary focus:ring-primary focus:border-primary"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-600 font-medium cursor-pointer select-none"
                >
                  I understand that this action is irreversible
                </Label>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mx-0 justify-end bg-transparent px-0 pt-5 pb-1 gap-2">
            <AlertDialogCancel className="border border-gray-200 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (campaignToDelete) {
                  handleDeleteCampaign(campaignToDelete.id);
                }
              }}
              disabled={!isConfirmed}
              className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
