"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Marquee from '@/components/layout/Marquee.jsx';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      router.push('/profile');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <Marquee />
      </div>
      
      {/* Background Overlay for better readability */}
      <div className="fixed inset-0 bg-black/40 z-10 backdrop-blur-[2px]" />

      <div className="relative z-20 w-full max-w-md animate-fade-in">
        <div className="glass-dark p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <i className="ri-pinterest-fill text-3xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white text-center">
              Welcome to Pinterest
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">Log in to see more</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 ml-1">Username</label>
              <input
                className="w-full glass-light rounded-2xl px-4 py-3 text-white placeholder:text-zinc-500 border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-zinc-400">Password</label>
                <Link href="#" className="text-xs font-semibold text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                className="w-full glass-light rounded-2xl px-4 py-3 text-white placeholder:text-zinc-500 border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4 shadow-lg shadow-primary/20"
            >
              Log in
            </button>

            {/* <div className="pt-6">
              <p className="text-[10px] text-zinc-500 text-center leading-relaxed px-4">
                By continuing, you agree to Pinterest's <span className="text-zinc-400 hover:underline cursor-pointer">Terms of Service</span> and acknowledge you've read our <span className="text-zinc-400 hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div> */}
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link href="/register" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Not on Pinterest yet? <span className="text-primary hover:underline ml-1">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
