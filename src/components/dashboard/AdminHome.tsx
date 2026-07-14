"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Users, UserCheck, Landmark, DollarSign } from 'lucide-react';

type Stats = {
  totalSupporters: number;
  totalCreators: number;
  totalAvailableCredits: number;
  totalPaymentsProcessed: number;
};

export default function AdminHome() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500 font-medium font-sans">Loading admin statistics...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 font-sans">Admin Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-sans">
        {/* Supporters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Supporters</h3>
            <p className="text-3xl font-extrabold text-gray-800 mt-2">
              {stats?.totalSupporters.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        {/* Creators */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Creators</h3>
            <p className="text-3xl font-extrabold text-gray-800 mt-2">
              {stats?.totalCreators.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <UserCheck size={24} />
          </div>
        </div>

        {/* Available Credits */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Available Credits</h3>
            <p className="text-3xl font-extrabold text-primary mt-2">
              {stats?.totalAvailableCredits.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="p-3 bg-green-50 text-primary rounded-xl">
            <Landmark size={24} />
          </div>
        </div>

        {/* Payments Processed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Payments Processed</h3>
            <p className="text-3xl font-extrabold text-orange-500 mt-2">
              ${stats?.totalPaymentsProcessed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00"}
            </p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
            <DollarSign size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
