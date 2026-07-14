"use client";
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, XCircle, Trash2, TriangleAlertIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

type CampaignType = {
  _id: string;
  title: string;
  creator_name: string;
  creator_email: string;
  funding_goal: number;
  deadline: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function CampaignApprovals() {
  const { user, token } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignToDelete, setCampaignToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const fetchPendingCampaigns = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCampaigns(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load pending campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchPendingCampaigns();
    }
  }, [user, token]);

  if (user?.role !== 'Admin') return <div className="p-6 text-red-500 font-bold">Unauthorized. Admins only.</div>;

  const handleStatusChange = async (id: string, title: string, newStatus: 'approved' | 'rejected') => {
    if (!token) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCampaigns(prev => prev.filter(c => c._id !== id));
      toast.success(`Campaign "${title}" has been successfully ${newStatus}!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || `Failed to update campaign status.`);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!token) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCampaigns(prev => prev.filter(c => c._id !== id));
      toast.success('Campaign deleted successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete campaign.');
    } finally {
      setCampaignToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Campaign Approvals</h2>
          <p className="text-xs text-gray-500 mt-0.5">Review and approve or reject newly submitted creator campaigns</p>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading pending campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No pending campaigns found for approval.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Creator</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Goal</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      <Link href={`/explore/${campaign._id}`} className="text-primary hover:underline transition-colors font-bold">
                        {campaign.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium text-gray-700">{campaign.creator_name}</div>
                      <div className="text-[11px] text-gray-400">{campaign.creator_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{campaign.funding_goal.toLocaleString()} Credits</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(campaign.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-100 text-yellow-800 uppercase tracking-wider">
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4 items-center">
                        <button 
                          onClick={() => handleStatusChange(campaign._id, campaign.title, 'approved')}
                          className="flex items-center text-primary hover:text-primary-dark transition-colors cursor-pointer border-none bg-transparent font-bold text-xs" 
                          title="Approve"
                        >
                          <CheckCircle size={18} className="mr-1" />
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusChange(campaign._id, campaign.title, 'rejected')}
                          className="flex items-center text-red-600 hover:text-red-800 transition-colors cursor-pointer border-none bg-transparent font-bold text-xs" 
                          title="Reject"
                        >
                          <XCircle size={18} className="mr-1" />
                          Reject
                        </button>
                        <button 
                          onClick={() => {
                            setCampaignToDelete({ id: campaign._id, title: campaign.title });
                            setIsConfirmed(false);
                          }}
                          className="flex items-center text-gray-400 hover:text-red-650 transition-colors cursor-pointer border-none bg-transparent font-bold text-xs" 
                          title="Delete"
                        >
                          <Trash2 size={18} className="mr-1" />
                          Delete
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

      {/* Delete Campaign Confirmation Alert Dialog */}
      <AlertDialog open={campaignToDelete !== null} onOpenChange={(open) => { if (!open) setCampaignToDelete(null); }}>
        <AlertDialogContent className="border border-gray-100 rounded-2xl bg-white p-7 shadow-xl max-w-md">
          <AlertDialogHeader className="place-items-start text-left font-sans">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-red-50">
              <TriangleAlertIcon className="size-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-gray-800">
              Delete campaign "{campaignToDelete?.title}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 mt-2 leading-relaxed">
              This action is permanent and cannot be undone. All associated campaign data
              will be removed forever.
              <span className="mt-5 flex items-center justify-start gap-3">
                <Checkbox
                  id="terms"
                  checked={isConfirmed}
                  onCheckedChange={(val) => setIsConfirmed(!!val)}
                  className="border-gray-300 rounded text-primary focus:ring-primary focus:border-primary"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-650 font-semibold cursor-pointer select-none"
                >
                  I understand that this action is irreversible
                </Label>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mx-0 justify-end bg-transparent px-0 pt-5 pb-1 gap-2 font-sans">
            <AlertDialogCancel className="border border-gray-200 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (campaignToDelete) {
                  handleDeleteCampaign(campaignToDelete.id);
                }
              }}
              disabled={!isConfirmed}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
