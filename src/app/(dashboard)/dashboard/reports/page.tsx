"use client";
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Trash2, TriangleAlertIcon, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
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

type ReportType = {
  _id: string;
  campaign_id: string;
  campaign_title: string;
  reporter_name: string;
  reporter_email: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved';
  createdAt: string;
};

export default function Reports() {
  const { user, token } = useAuth();
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionItem, setActionItem] = useState<{ type: 'resolve' | 'delete'; id: string; campaignId?: string; title: string } | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const fetchReports = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reports`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'Admin') {
      fetchReports();
    }
  }, [token, user]);

  if (user?.role !== 'Admin') return <div className="p-6 text-red-500 font-bold">Unauthorized. Admins only.</div>;

  const handleResolve = async (id: string) => {
    if (!token) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'resolved' } : r));
      toast.success('Report resolved successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to resolve report.');
    }
  };

  const handleDeleteCampaign = async (id: string, campaignId: string) => {
    if (!token) return;
    try {
      // 1. Delete the campaign
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 2. Resolve the report
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${id}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReports(prev => prev.map(r => r._id === id ? { ...r, status: 'resolved' } : r));
      toast.success('Reported campaign deleted and report marked as resolved!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete campaign.');
    } finally {
      setActionItem(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div className="flex items-center text-red-655 font-sans">
          <ShieldAlert className="mr-2.5 text-red-600" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Suspicious Activity Reports</h2>
            <p className="text-xs text-gray-500 mt-0.5">Investigate and take action on campaigns flagged by supporters</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium font-sans">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center space-y-2 font-sans">
            <CheckCircle size={40} className="text-green-500" />
            <p className="font-semibold text-lg text-gray-800">No reports found</p>
            <p className="text-sm text-gray-400">All submitted campaigns are currently clear.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Reported Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50/50 transition-colors font-sans">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {report.campaign_title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-semibold text-gray-700">{report.reporter_name}</div>
                      <div className="text-[11px] text-gray-400">{report.reporter_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                      {report.reason}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs break-words">
                      {report.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                      {new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider ${
                        report.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3 items-center">
                        {report.status === 'pending' ? (
                          <>
                            <button 
                              type="button"
                              onClick={() => handleResolve(report._id)}
                              className="flex items-center text-primary hover:text-primary-dark transition-colors cursor-pointer border-none bg-transparent font-bold text-xs" 
                              title="Mark as Resolved"
                            >
                              <CheckCircle size={16} className="mr-1" /> Resolve
                            </button>
                            <button 
                              type="button"
                              onClick={() => {
                                setActionItem({ type: 'delete', id: report._id, campaignId: report.campaign_id, title: report.campaign_title });
                                setIsConfirmed(false);
                              }}
                              className="flex items-center text-red-655 hover:text-red-850 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold text-xs shadow-xs text-red-600" 
                              title="Delete Fraudulent Campaign"
                            >
                              <Trash2 size={14} className="mr-1.5" /> Delete Campaign
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 font-bold">No Action Needed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Campaign Deletion Confirmation Alert Dialog */}
      <AlertDialog open={actionItem !== null} onOpenChange={(open) => { if (!open) setActionItem(null); }}>
        <AlertDialogContent className="border border-gray-100 rounded-2xl bg-white p-7 shadow-xl max-w-md font-sans">
          <AlertDialogHeader className="place-items-start text-left font-sans">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-red-50">
              <TriangleAlertIcon className="size-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-gray-800 font-sans">
              Delete campaign "{actionItem?.title}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 mt-2 leading-relaxed font-sans">
              This action is permanent and cannot be undone. The campaign and all associated data will be removed forever.
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
                if (actionItem && actionItem.campaignId) {
                  handleDeleteCampaign(actionItem.id, actionItem.campaignId);
                }
              }}
              disabled={!isConfirmed}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
