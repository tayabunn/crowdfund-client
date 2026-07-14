"use client";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Home, List, PlusCircle, CreditCard, Users, FileText, Settings, Bell, LogOut, Check, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, token, logout, isLoading } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  interface NotificationType {
    _id: string;
    message: string;
    toEmail: string;
    actionRoute: string;
    read: boolean;
    createdAt: string;
    time?: string;
  }

  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!token) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getRedirectPath = (actionRoute: string) => {
    if (actionRoute === '/dashboard/supporter-home') {
      return '/dashboard';
    }
    if (actionRoute === '/dashboard/creator-home') {
      return '/dashboard';
    }
    return actionRoute;
  };

  const handleNotificationClick = async (notification: NotificationType) => {
    if (!notification.read) {
      await handleMarkAsRead(notification._id);
    }
    setShowNotifications(false);
    const redirectPath = getRedirectPath(notification.actionRoute);
    router.push(redirectPath);
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return `${diffDays}d ago`;
    } catch (e) {
      return 'Recently';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect via AuthContext
  }

  const navItems = {
    Supporter: [
      { name: 'Home', href: '/dashboard', icon: <Home size={20} /> },
      { name: 'Explore Campaigns', href: '/explore', icon: <List size={20} /> },
      { name: 'My Contributions', href: '/dashboard/contributions', icon: <FileText size={20} /> },
      { name: 'Approved Contributions', href: '/dashboard/approved-contributions', icon: <CheckCircle size={20} /> },
      { name: 'Purchase Credit', href: '/dashboard/purchase-credit', icon: <CreditCard size={20} /> },
      { name: 'Payment History', href: '/dashboard/payment-history', icon: <FileText size={20} /> },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: <Settings size={20} /> },
    ],
    Creator: [
      { name: 'Home', href: '/dashboard', icon: <Home size={20} /> },
      { name: 'Add New Campaign', href: '/dashboard/add-campaign', icon: <PlusCircle size={20} /> },
      { name: 'My Campaigns', href: '/dashboard/my-campaigns', icon: <List size={20} /> },
      { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: <CreditCard size={20} /> },
      { name: 'Payment History', href: '/dashboard/payment-history', icon: <FileText size={20} /> },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: <Settings size={20} /> },
    ],
    Admin: [
      { name: 'Home', href: '/dashboard', icon: <Home size={20} /> },
      { name: 'Manage Users', href: '/dashboard/users', icon: <Users size={20} /> },
      { name: 'Manage Campaigns', href: '/dashboard/manage-campaigns', icon: <List size={20} /> },
      { name: 'Campaign Approvals', href: '/dashboard/campaign-approvals', icon: <CheckCircle size={20} /> },
      { name: 'Withdrawal Requests', href: '/dashboard/withdrawal-requests', icon: <CreditCard size={20} /> },
      { name: 'Reports', href: '/dashboard/reports', icon: <FileText size={20} /> },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: <Settings size={20} /> },
    ]
  };

  const currentNav = navItems[user.role] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-dark text-white flex flex-col border-r border-gray-800">
        {/* 1. Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <Link href="/" className="text-2xl font-bold text-primary">CrowdFund</Link>
        </div>

        {/* 2. Available Credits | User Image */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-700/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Available Credits</span>
            <span className="text-lg font-bold text-secondary">{user.credits}</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden shadow-inner ring-2 ring-primary/50">
            {user.photo_url ? (
              <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              (user.name || 'U').charAt(0).toUpperCase()
            )}
          </div>
        </div>

        {/* 3. User Role | User Name */}
        <div className="px-6 py-3 border-b border-gray-700/50 bg-gray-800/20">
          <div className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">{user.role}</div>
          <div className="text-sm font-semibold text-gray-200 truncate">{user.name || 'User'}</div>
        </div>



        {/* 5. Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {currentNav.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors group"
              >
                <span className="mr-3 text-gray-400 group-hover:text-primary transition-colors">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-700">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-md transition-colors">
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-xs flex items-center justify-between px-6 z-30 border-b border-gray-100 relative">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{user?.role} Dashboard</h1>
          </div>

          {/* Notifications Bell Icon and Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-50 cursor-pointer flex items-center justify-center border-none bg-transparent"
              title="Notifications"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Click-away overlay */}
            {showNotifications && (
              <div 
                className="fixed inset-0 z-40 bg-transparent cursor-default" 
                onClick={() => setShowNotifications(false)}
              />
            )}

            {/* Floating Pop-up */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50 font-sans">
                <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800 font-sans">Notifications</span>
                  {notifications.some(n => !n.read) && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] text-primary hover:text-primary-dark font-bold hover:underline cursor-pointer border-none bg-transparent font-sans"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-400 font-sans">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-3.5 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col space-y-1 relative ${
                          !notification.read ? 'bg-primary/5 border-l-3 border-primary' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start space-x-2">
                          <p className={`text-xs text-gray-700 leading-normal font-sans ${!notification.read ? 'font-semibold text-gray-900' : ''}`}>
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(notification._id, e)}
                              className="text-primary hover:text-primary-dark p-0.5 rounded transition cursor-pointer flex-shrink-0 border-none bg-transparent"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium font-sans">
                          {formatTime(notification.time || notification.createdAt)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* 6. Sections Based on Routes */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>

        {/* 7. Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} CrowdFund. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
