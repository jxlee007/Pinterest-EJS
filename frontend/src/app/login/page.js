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
    <div className="relative">
      <Marquee />
      <div className="container mx-auto">
        <div className="w-full h-screen flex justify-center items-center mx-10">
          <div className="w-96 bg-white px-8 py-4 rounded-3xl">
            <h1 className="py-4 mx-11 mb-2 text-xl sm:text-black text-black text-center tracking-tight capitalize font-semibold leading-none">
              Welcome to Pinterest
            </h1>

            {error && <p className="text-red-600 capitalize m-2 font-medium">{error}</p>}

            <form onSubmit={handleSubmit}>
              <input
                className="block border-2 border-slate-300 bg-slate-200 rounded-xl my-2 w-full px-2 py-2 text-black"
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className="block border-2 border-slate-300 bg-slate-200 rounded-xl my-2 w-full px-2 py-2 text-black"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a className="mt-2 font-semibold inline-block text-black" href="#">
                Forgot Password?
              </a>
              <input
                className="block border-[3px] rounded-full mt-2 w-full px-3 py-2 bg-red-600 text-white cursor-pointer font-bold"
                type="submit"
                value="Login"
              />

              <p className="text-xs font-semibold mt-5 text-center w-3/4 mx-auto text-black">
                By continuing, you agree to Pinterest's Terms of Service and acknowledge you've read our Privacy Policy. Notice at collection.
              </p>
            </form>

            <Link href="/register" className="inline-block w-full mt-7 text-center text-m font-semibold text-zinc-700 hover:text-black">
              Not on Pinterest yet? <strong>Sign Up</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
