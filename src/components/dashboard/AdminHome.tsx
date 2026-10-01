"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Users, UserCheck, Landmark, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // Chart Data
  const userData = [
    { name: 'Supporters', value: stats?.totalSupporters || 0, color: '#10b981' }, // Emerald
    { name: 'Creators', value: stats?.totalCreators || 0, color: '#8b5cf6' }     // Purple
  ];

  const financialData = [
    { name: 'Available Credits', Amount: stats?.totalAvailableCredits || 0 },
    { name: 'Payments ($)', Amount: stats?.totalPaymentsProcessed || 0 }
  ];

  return (
    <div className="font-sans">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Supporters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Supporters</h3>
            <p className="text-3xl font-extrabold text-gray-800 mt-2">
              {stats?.totalSupporters.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
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
            <p className="text-3xl font-extrabold text-emerald-500 mt-2">
              {stats?.totalAvailableCredits.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="p-3 bg-green-50 text-emerald-600 rounded-xl">
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

      {/* Visual Analytics Charts */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Distribution Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-700 font-bold text-base mb-4">User Roles Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} users`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Financial Metrics Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-700 font-bold text-base mb-4">Platform Financial Metrics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
                  <Bar dataKey="Amount" fill="#059669" radius={[10, 10, 0, 0]}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
