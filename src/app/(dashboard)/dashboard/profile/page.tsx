"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
      });
      setPreviewUrl(user.photo_url || null);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      let finalPhotoUrl = user.photo_url || '';

      if (file) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        const imgbbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            method: 'POST',
            body: formDataUpload,
          }
        );

        if (!imgbbRes.ok) {
          throw new Error('Failed to upload image to ImgBB');
        }

        const imgbbData = await imgbbRes.json();
        finalPhotoUrl = imgbbData.data.url;
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          name: formData.name,
          email: formData.email,
          photo_url: finalPhotoUrl
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update state in Context
      updateUser(res.data);
      toast.success('Profile updated successfully!');
      setFile(null);
    } catch (err: any) {
      console.error('Profile update error:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || err.message || 'Failed to update profile. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Image Preview & Input */}
        <div className="flex flex-col items-center sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 pb-6 border-b border-gray-100">
          <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-md">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              (formData.name || 'U').charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20
                border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${
              isSaving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
