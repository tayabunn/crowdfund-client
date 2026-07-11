"use client";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Home, List, PlusCircle, CreditCard, Users, FileText, Settings, Bell, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

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
      { name: 'Purchase Credit', href: '/dashboard/purchase-credit', icon: <CreditCard size={20} /> },
      { name: 'Payment History', href: '/dashboard/payment-history', icon: <FileText size={20} /> },
    ],
    Creator: [
      { name: 'Home', href: '/dashboard', icon: <Home size={20} /> },
      { name: 'Add New Campaign', href: '/dashboard/add-campaign', icon: <PlusCircle size={20} /> },
      { name: 'My Campaigns', href: '/dashboard/my-campaigns', icon: <List size={20} /> },
      { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: <CreditCard size={20} /> },
      { name: 'Payment History', href: '/dashboard/payment-history', icon: <FileText size={20} /> },
    ],
    Admin: [
      { name: 'Home', href: '/dashboard', icon: <Home size={20} /> },
      { name: 'Manage Users', href: '/dashboard/users', icon: <Users size={20} /> },
      { name: 'Manage Campaigns', href: '/dashboard/manage-campaigns', icon: <List size={20} /> },
      { name: 'Withdrawal Requests', href: '/dashboard/withdrawal-requests', icon: <CreditCard size={20} /> },
      { name: 'Reports', href: '/dashboard/reports', icon: <FileText size={20} /> },
    ]
  };

  const currentNav = navItems[user.role] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-dark text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-700">
          <Link href="/" className="text-2xl font-bold text-primary">CrowdFund</Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {currentNav.map((item) => (
              <Link key={item.name} href={item.href} className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-800 text-gray-300 hover:text-white group">
                <span className="mr-3 text-gray-400 group-hover:text-primary">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-md">
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{user.role} Dashboard</h1>
          </div>
          <div className="flex items-center space-x-6 relative">
            <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              Credits: {user.credits}
            </div>
            
            <button 
              className="text-gray-500 hover:text-primary relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={24} />
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute top-10 right-16 w-80 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-700">Notifications</div>
                <div className="max-h-64 overflow-y-auto">
                  {/* Dummy Notifications */}
                  <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                    <p className="text-sm text-gray-800">Your contribution to "Solar Pump" was approved!</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
                {user.photo_url ? (
                  <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
