"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="flex justify-center items-center h-screen bg-[#27272a]">
      <div className="w-96 bg-white text-black px-8 py-8 rounded-3xl">
        <h1 className="mb-6 text-2xl text-center font-bold tracking-tight">Welcome to Pinterest</h1>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border-2 border-slate-300 bg-slate-100 rounded-xl px-4 py-3"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="border-2 border-slate-300 bg-slate-100 rounded-xl px-4 py-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="rounded-full mt-2 w-full px-3 py-3 font-bold bg-red-600 text-white hover:bg-red-700">
            Login
          </button>
        </form>

        <p className="text-xs font-semibold mt-5 text-center text-gray-500">
          By continuing, you agree to Pinterest's Terms of Service...
        </p>
        <div className="mt-6 text-center">
          <Link href="/register" className="font-semibold text-zinc-700 hover:text-black">
            Not on Pinterest yet? <strong>Sign Up</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}
