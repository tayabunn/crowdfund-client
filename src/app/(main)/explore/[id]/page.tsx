"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import { Calendar, DollarSign, Target, Award, User, ArrowLeft, ShieldAlert, Check, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Campaign = {
  _id: string;
  title: string;
  story: string;
  category: string;
  funding_goal: number;
  minimum_contribution: number;
  deadline: string;
  reward_info: string;
  image_url: string;
  creator_name: string;
  creator_email: string;
  amount_raised: number;
  status: string;
};

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token, updateUser } = useAuth();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertAmount, setAlertAmount] = useState('');
  const [alertCampaignTitle, setAlertCampaignTitle] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Fraudulent or Scam project');
  const [reportDetails, setReportDetails] = useState('');
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCampaignDetails();
    }
  }, [id]);

  const fetchCampaignDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`);
      setCampaign(res.data);
    } catch (err: any) {
      console.error('Error fetching campaign details:', err);
      toast.error('Failed to load campaign details.');
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'Supporter') {
      toast.error('Only Supporters can make contributions.');
      return;
    }
    if (!campaign) return;

    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid contribution amount.');
      return;
    }

    if (amount < campaign.minimum_contribution) {
      toast.error(`Minimum contribution is ${campaign.minimum_contribution} credits.`);
      return;
    }

    if (user.credits < amount) {
      toast.error('Insufficient credits in your account.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/contributions`,
        {
          campaign_id: campaign._id,
          campaign_title: campaign.title,
          contribution_amount: amount,
          Contribution_amount: amount,
          creator_name: campaign.creator_name,
          creator_email: campaign.creator_email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Deduct client-side user credits in auth context
      updateUser({
        ...user,
        credits: user.credits - amount
      });

      setAlertAmount(contributionAmount);
      setAlertCampaignTitle(campaign.title);
      setShowSuccessAlert(true);
      
      toast.success('Contribution submitted successfully! Pending approval.');
      setContributionAmount('');
      
      // Refresh campaign data
      fetchCampaignDetails();
    } catch (err: any) {
      console.error('Error making contribution:', err);
      const errMsg = err.response?.data?.message || 'Failed to submit contribution. Please try again.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in to report a campaign.');
      return;
    }
    if (!campaign) return;
    if (!reportDetails.trim()) {
      toast.error('Please enter report details.');
      return;
    }
    setReporting(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reports`,
        {
          campaign_id: campaign._id,
          campaign_title: campaign.title,
          reason: reportReason,
          details: reportDetails
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Report submitted successfully! The administrators will review it.');
      setShowReportModal(false);
      setReportDetails('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
        <p className="text-gray-600 mb-8">The campaign you are looking for does not exist or has been removed.</p>
        <Link href="/explore" className="inline-flex items-center text-primary font-bold hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to Explore
        </Link>
      </div>
    );
  }

  const percentRaised = Math.min(Math.round(((campaign.amount_raised || 0) / campaign.funding_goal) * 100), 100);
  
  const getDaysLeft = () => {
    const today = new Date();
    const deadlineDate = new Date(campaign.deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = getDaysLeft();

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6">
          <Link href="/explore" className="inline-flex items-center text-gray-600 hover:text-primary font-semibold transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Explore
          </Link>
        </div>

        {/* Success Alert Banner */}
        {showSuccessAlert && (
          <div className="mb-8 bg-primary text-white rounded-3xl p-6 shadow-md flex flex-col gap-3 sm:flex-row sm:items-start transition-all duration-300 border-none">
            <div className="flex w-full items-start gap-4">
              <Check className="size-6 shrink-0 mt-0.5 bg-white/20 p-1 rounded-full text-white" />
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-extrabold text-lg text-white">Contribution Successful!</h4>
                  <p className="text-white/80 text-sm text-wrap leading-relaxed">
                    Your contribution of <span className="font-bold text-white">{alertAmount} credits</span> to <span className="font-bold text-white">"{alertCampaignTitle}"</span> was submitted successfully! It is currently pending approval.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button 
                    onClick={() => setShowSuccessAlert(false)}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold h-8 rounded-xl px-4 cursor-pointer transition-colors"
                  >
                    Later
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-secondary hover:bg-secondary/90 text-dark text-xs font-bold h-8 rounded-xl px-4 cursor-pointer transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
              <button
                className="text-white/70 hover:text-white shrink-0 cursor-pointer p-1 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setShowSuccessAlert(false)}
              >
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>
        )}

        {/* Campaign Header & Title */}
        <div className="mb-8">
          <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            {campaign.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-4 leading-tight">
            {campaign.title}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
            <div className="flex items-center">
              <User size={16} className="text-gray-400 mr-1.5" />
              <span>Created by <span className="font-semibold text-gray-800">{campaign.creator_name}</span></span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-400 mr-1.5" />
              <span>Ends on {new Date(campaign.deadline).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Image, Story, Rewards */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-video relative">
              <img 
                src={campaign.image_url || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80"} 
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80";
                }}
                alt={campaign.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Campaign Story */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center">
                <Target size={22} className="text-primary mr-2" /> Our Story
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                {campaign.story}
              </div>
            </div>

            {/* Rewards & Rewards Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center">
                <Award size={22} className="text-primary mr-2" /> Reward Program
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                {campaign.reward_info}
              </div>
            </div>
          </div>

          {/* Right Column: Funding Progress & Contribution Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-6">
              {/* Stats overview */}
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-extrabold text-primary">
                    ${(campaign.amount_raised || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    raised of ${campaign.funding_goal.toLocaleString()} goal
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-1000"
                      style={{ width: `${percentRaised}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mt-2">
                    <span>{percentRaised}% Funded</span>
                    <span>{campaign.amount_raised >= campaign.funding_goal ? 'Goal Achieved!' : 'Ongoing'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{daysLeft}</div>
                    <div className="text-xs text-gray-500">Days left</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{campaign.minimum_contribution}</div>
                    <div className="text-xs text-gray-500">Min. Credits</div>
                  </div>
                </div>
              </div>

              {/* Contribution Interactive Section */}
              <div className="mt-8">
                {user ? (
                  user.role === 'Supporter' ? (
                    <form onSubmit={handleContribute} className="space-y-4">
                      <div className="bg-gray-50 px-4 py-3 rounded-2xl flex items-center justify-between border border-gray-100 mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Balance</span>
                        <span className="text-sm font-extrabold text-gray-800">{user.credits} Credits</span>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="Contribution_amount" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                          Contribution_amount
                        </label>
                        <div className="relative rounded-2xl shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <DollarSign size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="number"
                            id="Contribution_amount"
                            name="Contribution_amount"
                            min={campaign.minimum_contribution}
                            required
                            placeholder={`Min. ${campaign.minimum_contribution}`}
                            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-primary focus:border-primary sm:text-sm bg-gray-50/50 focus:bg-white transition-all outline-none"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-3.5 px-4 border border-transparent rounded-2xl shadow-md text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${
                          submitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {submitting ? 'Processing...' : 'Contribute to Project'}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-yellow-50/60 border border-yellow-200/50 rounded-2xl p-4 text-center">
                      <ShieldAlert className="text-yellow-600 mx-auto mb-2" size={24} />
                      <p className="text-sm font-semibold text-yellow-800">Creators & Admins Cannot Contribute</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Please log in with a Supporter account to make contributions.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center p-4 border border-dashed border-gray-200 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-4">Please log in to support this campaign.</p>
                    <Link
                      href="/login"
                      className="inline-block w-full py-3 px-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-sm"
                    >
                      Login to Contribute
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Report Campaign Action */}
            {user && (
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs text-center flex flex-col items-center">
                <ShieldAlert className="text-red-500 mb-2" size={24} />
                <h4 className="text-sm font-bold text-gray-800 font-sans">Suspicious Campaign?</h4>
                <p className="text-xs text-gray-400 mt-1 leading-normal mb-3 font-sans">
                  If you think this campaign is fraudulent or violates our rules, please report it to the administrators.
                </p>
                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all cursor-pointer font-sans"
                >
                  Report Campaign
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-50 transform scale-100 transition-all duration-300">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <ShieldAlert size={28} />
              <h3 className="text-xl font-bold text-gray-900 font-sans">Report Campaign</h3>
            </div>
            
            <p className="text-xs text-gray-400 mb-6 leading-relaxed font-sans">
              Help us keep the community safe. Tell us what is wrong with the campaign <strong>"{campaign.title}"</strong>.
            </p>
            
            <form onSubmit={handleReport} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-sans">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm font-bold text-gray-700 cursor-pointer font-sans"
                >
                  <option value="Fraudulent or Scam project">Fraudulent or Scam project</option>
                  <option value="Violates Intellectual Property">Violates Intellectual Property</option>
                  <option value="Misleading Campaign claims">Misleading Campaign claims</option>
                  <option value="Other suspicious activity">Other suspicious activity</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-sans">Details / Evidence</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please provide details or links verifying your report..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm font-medium text-gray-700 placeholder-gray-400 outline-none transition-all resize-none font-sans"
                />
              </div>
              
              <div className="flex space-x-3 pt-3 border-t border-gray-50 font-sans">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-bold text-gray-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reporting}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {reporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
