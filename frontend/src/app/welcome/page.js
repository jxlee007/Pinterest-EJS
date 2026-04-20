"use client";

import Marquee from '@/components/layout/Marquee.jsx';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <Marquee />
      </div>
      
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/40 z-10 backdrop-blur-[2px]" />

      <div className="relative z-20 w-full max-w-md animate-fade-in">
        <div className="glass-dark p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
              <i className="ri-pinterest-fill text-4xl text-primary"></i>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white text-center">
              Welcome to Pinterest
            </h1>
            <p className="text-zinc-400 mt-2 text-sm text-center px-4">
              Join the world's most creative community to find and save ideas.
            </p>
          </div>

          <div className="space-y-4 flex flex-col items-center w-full">
            <Link 
              href="/register" 
              className="w-full flex justify-center bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              Continue with Sign-Up
            </Link>
            
            <Link 
              href="/explore" 
              className="w-full flex justify-center glass-light hover:bg-white/10 text-white font-bold py-3 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] border-white/10"
            >
              Explore
            </Link>

            <div className="pt-6 w-full text-center">
              <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                Already on Pinterest? <span className="text-primary hover:underline ml-1">Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
