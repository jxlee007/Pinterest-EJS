"use client";

import { useState } from 'react';
import { authApi } from '@/services/auth.api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    contact: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.register(formData);
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#27272a]">
      <div className="w-[400px] bg-white text-black px-8 py-8 rounded-3xl shadow-xl">
        <h1 className="mb-6 text-2xl text-center font-bold">Create New Account</h1>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="border-2 border-slate-300 bg-slate-100 rounded-xl px-4 py-2" type="text" name="fullname" placeholder="Full name" value={formData.fullname} onChange={handleChange} required />
          <input className="border-2 border-slate-300 bg-slate-100 rounded-xl px-4 py-2" type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input className="border-2 border-slate-300 bg-slate-100 rounded-xl px-4 py-2" type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input className="border-2 border-slate-300 bg-slate-100 rounded-xl px-4 py-2" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input className="border-2 border-slate-300 bg-slate-100 rounded-xl px-4 py-2" type="tel" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />

          <button type="submit" className="rounded-full mt-4 w-full px-3 py-3 font-bold bg-red-600 text-white hover:bg-red-700">
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="font-semibold text-zinc-700 hover:text-black">
            Already on Pinterest? <strong>Sign In</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}
