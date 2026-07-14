"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Supporter' | 'Creator' | 'Admin';
  credits: number;
  photo_url?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('secret-access-token') || localStorage.getItem('access-token') || localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken === 'undefined' || storedToken === null) {
      localStorage.removeItem('token');
      localStorage.removeItem('secret-access-token');
      localStorage.removeItem('access-token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsLoading(false);
    } else if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // Fetch latest profile from server to sync credits, etc.
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`)
        .then(res => {
          localStorage.setItem('user', JSON.stringify(res.data));
          setUser(res.data);
        })
        .catch(err => {
          console.error('Failed to sync user profile:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If navigating to a private route without being logged in, redirect to login
    // Note: User requested "After reloading the page on a private route, the user should not be redirected to the login page."
    // We achieve this by waiting for isLoading to finish before redirecting.
    if (!isLoading) {
      if (!user && pathname.startsWith('/dashboard')) {
        router.push('/login');
      } else if (user && (pathname === '/login' || pathname === '/register')) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('secret-access-token', newToken);
    localStorage.setItem('access-token', newToken);
    localStorage.setItem('accessToken', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('secret-access-token');
    localStorage.removeItem('access-token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
