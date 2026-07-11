"use client";
import { useAuth } from '@/context/AuthContext';
import SupporterHome from '@/components/dashboard/SupporterHome';
import CreatorHome from '@/components/dashboard/CreatorHome';
import AdminHome from '@/components/dashboard/AdminHome';

export default function DashboardHome() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {user.role === 'Supporter' && <SupporterHome />}
      {user.role === 'Creator' && <CreatorHome />}
      {user.role === 'Admin' && <AdminHome />}
    </>
  );
}
