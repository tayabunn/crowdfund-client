"use client";
import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, Clock, Target, Calendar, User, Heart, Share2, 
  Gift, CheckCircle2, MessageSquare, Megaphone, Flag, Send, 
  HelpCircle, ShieldCheck, Sparkles, Check, X, FileText, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import ShareModal from '@/components/ShareModal';
import ReceiptModal from '@/components/ReceiptModal';

interface RewardTier {
  _id?: string;
  title: string;
  description: string;
  amount: number;
  estimated_delivery?: string;
  items?: string[];
  claimed_count?: number;
  max_slots?: number;
}

interface StretchGoal {
  _id?: string;
  amount: number;
  title: string;
  description: string;
  is_unlocked: boolean;
}

interface CampaignUpdate {
  _id?: string;
  title: string;
  content: string;
  date: string;
  author_name: string;
}

interface CommentReply {
  _id?: string;
  user_name: string;
  user_email: string;
  user_photo?: string;
  user_role: string;
  text: string;
  date: string;
}

interface Comment {
  _id?: string;
  user_name: string;
  user_email: string;
  user_photo?: string;
  user_role: string;
  text: string;
  date: string;
  replies?: CommentReply[];
}

interface Campaign {
  _id: string;
  title: string;
  story: string;
  category: string;
  funding_goal: number;
  minimum_contribution: number;
  deadline: string;
  reward_info: string;
  image_url: string;
  status: 'pending' | 'approved' | 'rejected';
  creator_name: string;
  creator_email: string;
  amount_raised: number;
  funding_type?: 'flexible' | 'fixed';
  rewards?: RewardTier[];
  stretch_goals?: StretchGoal[];
  updates?: CampaignUpdate[];
  comments?: Comment[];
}

export default function CampaignDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'story';

  const { user, token } = useAuth();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState<number | ''>('');
  const [selectedReward, setSelectedReward] = useState<RewardTier | null>(null);
  const [message, setMessage] = useState('');
  const [contributing, setContributing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'rewards' | 'stretch' | 'updates' | 'comments'>(initialTab as any);

  // Modals & Popups
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  // Comments
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Creator update
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [postingUpdate, setPostingUpdate] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Fetch campaign
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`);
        setCampaign(res.data);
        if (res.data.minimum_contribution) {
          setContributionAmount(res.data.minimum_contribution);
        }
      } catch (err) {
        console.error('Error fetching campaign:', err);
        toast.error('Failed to load campaign details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  // Check if bookmarked
  useEffect(() => {
    if (token && user) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/bookmarks/my-saved`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const isSaved = res.data.some((c: any) => c._id === id || c === id);
        setIsBookmarked(isSaved);
      }).catch(() => {});
    }
  }, [token, user, id]);

  const toggleBookmark = async () => {
    if (!token) {
      toast.info('Please log in to save campaigns to your watchlist.');
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsBookmarked(res.data.isSaved);
      toast.success(res.data.isSaved ? 'Saved to your Watchlist!' : 'Removed from Watchlist.');
    } catch (err) {
      toast.error('Could not update watchlist.');
    }
  };

  const handleSelectReward = (reward: RewardTier) => {
    setSelectedReward(reward);
    setContributionAmount(reward.amount);
    toast.info(`Selected "${reward.title}" tier (${reward.amount} credits).`);
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please log in as a Supporter to back this campaign.');
      router.push('/login');
      return;
    }

    if (user?.role !== 'Supporter') {
      toast.error('Only Supporters can contribute credits.');
      return;
    }

    const amount = Number(contributionAmount);
    if (!amount || amount < (campaign?.minimum_contribution || 1)) {
      toast.error(`Minimum contribution is ${campaign?.minimum_contribution || 1} credits.`);
      return;
    }

    if ((user.credits || 0) < amount) {
      toast.error('Insufficient credit balance. Please purchase more credits.');
      router.push('/dashboard/purchase-credit');
      return;
    }

    setContributing(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/contributions`,
        {
          campaign_id: campaign?._id,
          campaign_title: campaign?.title,
          contribution_amount: amount,
          creator_name: campaign?.creator_name,
          creator_email: campaign?.creator_email,
          message,
          reward_id: selectedReward?._id || '',
          reward_title: selectedReward?.title || ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Create Receipt Data
      setReceiptData({
        transactionId: res.data._id || 'TX-' + Math.random().toString(36).substring(2, 9),
        campaignTitle: campaign?.title || '',
        creatorName: campaign?.creator_name || '',
        supporterName: user.name || 'Supporter',
        supporterEmail: user.email,
        credits: amount,
        rewardTitle: selectedReward?.title,
        date: new Date().toISOString()
      });

      setIsReceiptOpen(true);
      toast.success('🎉 Thank you for backing this project!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Contribution failed.');
    } finally {
      setContributing(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.info('Please log in to leave a comment.');
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCampaign(prev => prev ? { ...prev, comments: res.data } : null);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handlePostReply = async (commentId: string) => {
    if (!token) {
      toast.info('Please log in to reply.');
      return;
    }
    if (!replyText.trim()) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}/comments/${commentId}/reply`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCampaign(prev => prev ? { ...prev, comments: res.data } : null);
      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply posted!');
    } catch (err: any) {
      toast.error('Failed to post reply.');
    }
  };

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateTitle.trim() || !newUpdateContent.trim()) return;

    setPostingUpdate(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}/updates`,
        { title: newUpdateTitle, content: newUpdateContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCampaign(prev => prev ? { ...prev, updates: res.data } : null);
      setNewUpdateTitle('');
      setNewUpdateContent('');
      setShowUpdateForm(false);
      toast.success('Campaign update posted and contributors notified!');
    } catch (err: any) {
      toast.error('Failed to post update.');
    } finally {
      setPostingUpdate(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in to report a campaign.');
      return;
    }
    setSubmittingReport(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reports`,
        {
          campaign_id: campaign?._id,
          campaign_title: campaign?.title,
          reason: reportReason,
          details: reportDetails
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Report submitted to administrator for investigation.');
      setIsReportOpen(false);
      setReportReason('');
      setReportDetails('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-bold text-sm">Loading campaign details...</span>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="w-[90%] mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Campaign Not Found</h2>
        <p className="text-gray-500 mb-8">The campaign you are looking for does not exist or has been removed.</p>
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
  const isCreator = user?.email === campaign.creator_email;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Modals */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        campaignTitle={campaign.title}
        campaignId={campaign._id}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        data={receiptData}
      />

      <div className="w-[90%] mx-auto">
        {/* Navigation bar */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/explore" className="inline-flex items-center text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Explore
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleBookmark}
              aria-label="Save to Watchlist"
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${
                isBookmarked 
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 text-red-500' 
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary'
              }`}
            >
              <Heart size={16} className={isBookmarked ? 'fill-red-500' : ''} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="p-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Campaign Header & Badges */}
        <div className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-primary/10 text-primary border border-primary/20 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {campaign.category}
            </span>
            <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
              {campaign.funding_type === 'fixed' ? '🔒 All or Nothing' : '⚡ Flexible Funding'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            {campaign.title}
          </h1>

          <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-4 pt-1">
            <div className="flex items-center">
              <User size={16} className="text-primary mr-1.5" />
              <span>Created by <span className="font-bold text-gray-900 dark:text-white">{campaign.creator_name}</span></span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1.5" />
              <span>Ends on {new Date(campaign.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Tabs & Right Pledge Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Banner */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 aspect-video relative">
              <img 
                src={campaign.image_url || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80"} 
                alt={campaign.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Interactive Tab Bar */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs">
              {[
                { key: 'story', label: 'Story & Pitch', icon: Target },
                { key: 'rewards', label: `Rewards (${campaign.rewards?.length || 1})`, icon: Gift },
                { key: 'stretch', label: `Stretch Goals (${campaign.stretch_goals?.length || 0})`, icon: Sparkles },
                { key: 'updates', label: `Updates (${campaign.updates?.length || 0})`, icon: Megaphone },
                { key: 'comments', label: `Discussion (${campaign.comments?.length || 0})`, icon: MessageSquare }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 dark:border-gray-800">
              
              {/* TAB 1: STORY */}
              {activeTab === 'story' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <Target className="text-primary" size={24} /> About this Project
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {campaign.story}
                  </div>

                  <div className="p-5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Standard Reward Info</div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{campaign.reward_info}</div>
                  </div>
                </div>
              )}

              {/* TAB 2: REWARDS & PERKS */}
              {activeTab === 'rewards' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Gift className="text-secondary" size={24} /> Backer Reward Tiers
                    </h2>
                    <span className="text-xs text-gray-400">Select a tier to pledge</span>
                  </div>

                  {(!campaign.rewards || campaign.rewards.length === 0) ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                      Standard backer reward: {campaign.reward_info}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {campaign.rewards.map((tier, idx) => {
                        const isSelected = selectedReward?.title === tier.title;
                        return (
                          <div 
                            key={idx}
                            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-primary/5 dark:bg-primary/10 border-primary shadow-md'
                                : 'bg-gray-50/70 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 hover:border-primary/40'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-black uppercase tracking-wider text-secondary">Tier #{idx + 1}</span>
                                {tier.claimed_count ? (
                                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                    {tier.claimed_count} Backers
                                  </span>
                                ) : null}
                              </div>

                              <h3 className="text-lg font-black text-gray-900 dark:text-white">{tier.title}</h3>
                              <div className="text-2xl font-black text-primary">
                                {tier.amount} <span className="text-xs font-bold text-gray-500">Credits (~${(tier.amount / 10).toFixed(0)})</span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{tier.description}</p>

                              {tier.estimated_delivery && (
                                <div className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5 pt-2">
                                  <Clock size={13} /> Est. Delivery: {tier.estimated_delivery}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleSelectReward(tier)}
                              className={`mt-6 w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-primary hover:text-white'
                              }`}
                            >
                              {isSelected ? <><Check size={14} /> Selected</> : 'Select this Perk'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: STRETCH GOALS */}
              {activeTab === 'stretch' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="text-primary" size={24} /> Stretch Goal Roadmap
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Bonus milestones unlocked as more community credits are raised.</p>
                  </div>

                  {(!campaign.stretch_goals || campaign.stretch_goals.length === 0) ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                      No stretch goals announced for this campaign yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {campaign.stretch_goals.map((goal, idx) => {
                        const isUnlocked = goal.is_unlocked || (campaign.amount_raised || 0) >= goal.amount;
                        return (
                          <div 
                            key={idx}
                            className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                              isUnlocked 
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50' 
                                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-80'
                            }`}
                          >
                            <div className={`p-3 rounded-2xl ${isUnlocked ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                              {isUnlocked ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">{goal.title}</h4>
                                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${isUnlocked ? 'bg-emerald-200/60 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                  {isUnlocked ? 'UNLOCKED' : `${goal.amount.toLocaleString()} Credits`}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{goal.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: UPDATES */}
              {activeTab === 'updates' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Megaphone className="text-primary" size={24} /> Milestone Updates
                    </h2>

                    {isCreator && (
                      <button
                        onClick={() => setShowUpdateForm(!showUpdateForm)}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        {showUpdateForm ? 'Cancel' : '+ Post Update'}
                      </button>
                    )}
                  </div>

                  {/* Creator Update Form */}
                  {isCreator && showUpdateForm && (
                    <form onSubmit={handlePostUpdate} className="p-5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
                      <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase">Post an Update to Backers</h4>
                      <input
                        type="text"
                        required
                        placeholder="Update Title (e.g. Tooling finalized, prototype testing next week!)"
                        value={newUpdateTitle}
                        onChange={(e) => setNewUpdateTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-white focus:outline-none"
                      />
                      <textarea
                        rows={4}
                        required
                        placeholder="Write your update description here..."
                        value={newUpdateContent}
                        onChange={(e) => setNewUpdateContent(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={postingUpdate}
                        className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                      >
                        {postingUpdate ? 'Posting...' : 'Publish Update'}
                      </button>
                    </form>
                  )}

                  {(!campaign.updates || campaign.updates.length === 0) ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                      No milestone updates published yet.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {campaign.updates.map((update, idx) => (
                        <div key={idx} className="p-6 bg-gray-50/70 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-primary">By {update.author_name} (Creator)</span>
                            <span className="text-gray-400">{new Date(update.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                          </div>
                          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{update.title}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{update.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: COMMENTS / DISCUSSION */}
              {activeTab === 'comments' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="text-primary" size={24} /> Backer Discussion & Q&A
                    </h2>
                  </div>

                  {/* New Comment Box */}
                  <form onSubmit={handlePostComment} className="space-y-3">
                    <textarea
                      rows={3}
                      placeholder={token ? "Ask a question or leave words of encouragement..." : "Please log in to leave a comment."}
                      disabled={!token || submittingComment}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs sm:text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!token || !newComment.trim() || submittingComment}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send size={14} /> {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </form>

                  {/* Comments Feed */}
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {(!campaign.comments || campaign.comments.length === 0) ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        Be the first to leave a comment or question!
                      </div>
                    ) : (
                      campaign.comments.map((comment, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-gray-900 dark:text-white">{comment.user_name}</span>
                              {comment.user_role === 'Creator' && (
                                <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">Creator</span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-400">{new Date(comment.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="pl-4 mt-2 space-y-2 border-l-2 border-primary/30">
                              {comment.replies.map((reply, rIdx) => (
                                <div key={rIdx} className="p-2.5 bg-white dark:bg-gray-900 rounded-xl text-xs space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900 dark:text-white">
                                      {reply.user_name} {reply.user_role === 'Creator' && '⭐ (Creator)'}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{new Date(reply.date).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Toggle */}
                          {token && (
                            <div className="pt-1">
                              {replyingTo === comment._id ? (
                                <div className="flex gap-2 pt-2">
                                  <input
                                    type="text"
                                    placeholder="Write your reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handlePostReply(comment._id!)}
                                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-xl"
                                  >
                                    Reply
                                  </button>
                                  <button
                                    onClick={() => setReplyingTo(null)}
                                    className="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-bold rounded-xl"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setReplyingTo(comment._id || null);
                                    setReplyText('');
                                  }}
                                  className="text-[11px] font-bold text-primary hover:underline"
                                >
                                  Reply
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Sticky Column: Stats & Contribution Widget */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 dark:border-gray-800 sticky top-24 space-y-6">
              
              {/* Raised Stats */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-primary">
                    {(campaign.amount_raised || 0).toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Goal: {campaign.funding_goal.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs font-semibold text-gray-500 mb-3">
                  Credits Raised ({percentRaised}% of goal)
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentRaised}%` }}
                  ></div>
                </div>
              </div>

              {/* Days Left & Minimum info */}
              <div className="grid grid-cols-2 gap-4 border-y border-gray-100 dark:border-gray-800 py-4 text-center">
                <div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">{daysLeft}</div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase">Days Left</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-secondary">{campaign.minimum_contribution}</div>
                  <div className="text-[11px] font-semibold text-gray-400 uppercase">Min Credits</div>
                </div>
              </div>

              {/* Selected Perk Banner */}
              {selectedReward && (
                <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Selected Perk:</span>
                    <div className="font-extrabold text-gray-900 dark:text-white">{selectedReward.title}</div>
                  </div>
                  <button 
                    onClick={() => setSelectedReward(null)} 
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Pledge Form */}
              <form onSubmit={handleContribute} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Credits to Contribute
                  </label>
                  <input
                    type="number"
                    min={campaign.minimum_contribution || 1}
                    required
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl font-black text-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Quick amount chips */}
                <div className="flex gap-2">
                  {[100, 250, 500, 1000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setContributionAmount(val)}
                      className="flex-1 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary text-gray-700 dark:text-gray-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      +{val}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Backer Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Words of encouragement..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={contributing || daysLeft <= 0}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-black text-base shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {contributing ? 'Processing Pledge...' : daysLeft <= 0 ? 'Campaign Ended' : 'Back this Project Now'}
                </button>
              </form>

              {/* Creator Card */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                  {campaign.creator_name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{campaign.creator_name}</div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-500" /> Verified Campaign Creator
                  </div>
                </div>
              </div>

              {/* Report campaign trigger */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <Flag size={12} /> Report this campaign
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2 text-red-500">
                <Flag size={18} /> Report Campaign
              </h3>
              <button onClick={() => setIsReportOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl text-xs font-bold"
                >
                  <option value="">Select a reason</option>
                  <option value="Fraud or Scam">Fraud or Scam</option>
                  <option value="Misleading Information">Misleading Information</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Copyright Violation">Copyright Violation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context for admin investigation..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl text-xs"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReport}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs"
              >
                {submittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
