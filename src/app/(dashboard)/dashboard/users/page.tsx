"use client";
import { useAuth } from '@/context/AuthContext';
import { Trash2, TriangleAlertIcon } from 'lucide-react';
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

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: 'Supporter' | 'Creator' | 'Admin';
  credits: number;
  photo_url?: string;
};

export default function ManageUsers() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'Admin') {
      fetchUsers();
    }
  }, [token, user]);

  if (user?.role !== 'Admin') return <div className="p-6 text-red-500 font-bold">Unauthorized. Admins only.</div>;

  const handleRoleChange = async (id: string, newRole: string) => {
    if (!token) return;
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: res.data.role } : u));
      toast.success(`Role updated to ${newRole} successfully!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!token) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User removed successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to remove user.');
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800">Manage Users</h2>
        <p className="text-xs text-gray-500 mt-0.5">Admin panel to change user roles or delete user profiles</p>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {u.photo_url ? (
                          <img 
                            src={u.photo_url} 
                            alt={u.name} 
                            className="h-10 w-10 rounded-full object-cover border border-gray-100 shadow-xs"
                          />
                        ) : (
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-400 font-medium">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{u.credits}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        className="text-xs border border-gray-300 rounded-xl focus:ring-primary focus:border-primary p-2 bg-white font-bold text-gray-700 shadow-xs cursor-pointer"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === user?.id}
                      >
                        <option value="Supporter">Supporter</option>
                        <option value="Creator">Creator</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        type="button"
                        onClick={() => {
                          setUserToDelete({ id: u._id, name: u.name });
                          setIsConfirmed(false);
                        }}
                        className="text-red-600 hover:text-red-800 flex items-center bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 px-3.5 py-1.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold text-xs shadow-xs" 
                        title="Remove User"
                        disabled={u._id === user?.id}
                      >
                        <Trash2 size={14} className="mr-1.5" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={userToDelete !== null} onOpenChange={(open) => { if (!open) setUserToDelete(null); }}>
        <AlertDialogContent className="border border-gray-100 rounded-2xl bg-white p-7 shadow-xl max-w-md">
          <AlertDialogHeader className="place-items-start text-left">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-red-50">
              <TriangleAlertIcon className="size-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-gray-800">
              Delete user "{userToDelete?.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 mt-2">
              This action is permanent and cannot be undone. All associated data
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
                if (userToDelete) {
                  handleDeleteUser(userToDelete.id);
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
