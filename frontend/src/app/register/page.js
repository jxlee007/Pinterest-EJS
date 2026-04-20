"use client";

import { useState } from 'react';
import { authApi } from '@/services/auth.api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Marquee from '@/components/layout/Marquee.jsx';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    contact: ''
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.fullname && formData.email) {
      setStep(2);
    }
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
    <div className="fixed inset-0 w-full h-screen overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0">
        <Marquee />
      </div>
      
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/40 z-10 backdrop-blur-[2px]" />

      <div className="relative z-20 w-full max-w-md animate-fade-in">
        <div className="glass-dark p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <i className="ri-pinterest-fill text-3xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white text-center">
              Create New Account
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">
              {step === 1 ? 'Start with your basics' : 'Finish your profile'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          <div className="relative overflow-hidden">
            <div className={`transition-all duration-500 transform ${step === 2 ? '-translate-x-full opacity-0 absolute pointer-events-none' : 'translate-x-0 opacity-100'}`}>
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 ml-1">Full Name</label>
                  <input
                    className="w-full glass-light rounded-2xl px-4 py-3 text-white placeholder:text-zinc-500 border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                    type="text"
                    name="fullname"
                    placeholder="Enter your full name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 ml-1">Email Address</label>
                  <input
                    className="w-full glass-light rounded-2xl px-4 py-3 text-white placeholder:text-zinc-500 border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Continue
                  <i className="ri-arrow-right-line"></i>
                </button>
              </form>
            </div>

            <div className={`transition-all duration-500 transform ${step === 1 ? 'translate-x-full opacity-0 absolute pointer-events-none' : 'translate-x-0 opacity-100'}`}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-white transition-colors mb-2"
                >
                  <i className="ri-arrow-left-s-line"></i> Back to basics
                </button>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 ml-1">Username</label>
                  <input
                    className="w-full glass-light rounded-2xl px-4 py-3 text-white placeholder:text-zinc-500 border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 ml-1">Password</label>
                  <input
                    className="w-full glass-light rounded-2xl px-4 py-3 text-white placeholder:text-zinc-500 border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 ml-1">Contact Number</label>
                  <input
                    className="w-full glass-light rounded-2xl px-4 py-3 text-white placeholder:text-zinc-500 border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                    type="tel"
                    name="contact"
                    placeholder="Your contact number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4 shadow-lg shadow-primary/20"
                >
                  Create account
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
              Already on Pinterest? <span className="text-primary hover:underline ml-1">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
