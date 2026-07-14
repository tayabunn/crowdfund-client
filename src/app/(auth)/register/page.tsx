"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo_url: '',
    role: 'Supporter'
  });
  const [file, setFile] = useState<File | null>(null);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password strength validation: Min 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }
    
    try {
      let finalPhotoUrl = '';
      
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
      
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        photo_url: finalPhotoUrl
      });
      
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
          token: tokenResponse.access_token,
          role: formData.role // passing the selected role
        });
        login(res.data.token, res.data.user);
      } catch (err) {
        setError('Failed to login with Google.');
      }
    },
    onError: () => {
      setError('Google login failed.');
    }
  });
  
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create a new account
      </h2>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {error && <div className="mb-4 text-red-500 text-center text-sm">{error}</div>}
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" required className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <p suppressHydrationWarning className="mt-1.5 text-xs text-gray-400 leading-normal">
                Password must be at least 8 characters long and contain both letters and numbers.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Profile Image</label>
              <div className="mt-1 flex items-center">
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
                  onChange={e => setFile(e.target.files?.[0] || null)} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">I want to join as a</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="Supporter">Supporter (Fund projects)</option>
                <option value="Creator">Creator (Start projects)</option>
              </select>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Register
              </button>
            </div>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
             <Link href="/login" className="text-sm text-primary hover:text-primary-dark">Already have an account? Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
