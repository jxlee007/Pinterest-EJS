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
    <div className="relative">
      <Marquee />
      <div className="container mx-auto">
        <div className="w-full h-screen sm:text-black text-white flex flex-col items-center justify-center">
          <div className="flex justify-center items-center flex-col sm:bg-white bg-gray-300 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 rounded-2xl font-semibold sm:px-4 px-0 py-3 sm:w-2/6 w-11/12">
            <svg className="gUZ NUb U9O kVc bg-slate-50 rounded-full border-white border-4 sm:mb-4" height="60" width="60" viewBox="0 0 24 24" aria-label="logo" role="img">
              <path d="M0 12a12 12 0 0 0 7.73 11.22 12 12 0 0 1 .03-3.57l1.4-5.94S8.8 13 8.8 11.94c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86a5.17 5.17 0 0 0-5.39 5.18c0 1.03.4 2.13.9 2.73q.12.17.08.34l-.34 1.36q-.06.31-.4.16c-1.49-.7-2.42-2.88-2.42-4.63 0-3.77 2.74-7.23 7.9-7.23 4.14 0 7.36 2.95 7.36 6.9 0 4.12-2.6 7.43-6.2 7.43-1.21 0-2.35-.63-2.74-1.37l-.74 2.84a14 14 0 0 1-1.55 3.23A12 12 0 1 0 0 12"></path>
            </svg>
            <h1 className="sm:text-black text-white mt-4 text-2xl">Welcome to Pinterest</h1>

            <Link href="/register" className="flex justify-center border-2 sm:mt-4 mt-12 w-4/6 px-1 py-2 bg-red-600 text-white rounded-full">
              Continue with Sign-Up
            </Link>
            <Link href="/explore" className="flex justify-center border-2 sm:mt-2 mt-12 w-4/6 px-1 py-2 bg-red-600 text-white rounded-full">
              Explore
            </Link>

            <Link href="/login" className="block text-center text-m font-semibold sm:mt-4 mt-8 sm:text-zinc-700 text-white">
              Already on Pinterest? <strong>Sign In</strong>
            </Link>

            <p className="text-xs sm:text-black text-white font-semibold sm:mt-5 mt-16 text-center w-3/4 mx-auto">
              By continuing, you agree to Pinterest's Terms of Service and acknowledge you've read our Privacy Policy. Notice at collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
