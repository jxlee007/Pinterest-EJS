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
    <div className="relative">
      <Marquee />
      <div className="container w-full h-screen relative flex justify-center items-center m-auto">
        <span className="flex flex-row items-center overflow-hidden w-full max-w-[400px]">
          {step === 1 ? (
            <div id="div1" className="flex flex-col mx-7 items-center h-fit sm:bg-white bg-transparent px-4 md:px-12 py-8 md:py-4 rounded-3xl w-full text-black">
              <span className="flex justify-start px-8 items-center border-b-2 w-[130%]">
                <Link href="/"><i className="ri-arrow-left-line"></i></Link>
                <h1 className="py-4 mx-11 w-48 mb-2 text-xl sm:text-black text-white text-center tracking-tight capitalize font-semibold leading-none">
                  Create New Account
                </h1>
              </span>
              <form className="my-4 w-full" onSubmit={handleNextStep}>
                <input className="block border-2 border-slate-300 bg-slate-200 rounded-xl my-2 w-full px-2 py-2" type="text" name="fullname" placeholder="Full name" value={formData.fullname} onChange={handleChange} required />
                <input className="block border-2 rounded-xl border-slate-300 bg-slate-200 my-2 w-full px-1 py-2" type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                <button type="submit" className="block border-2 rounded-full w-full py-2 bg-red-600 text-white font-bold cursor-pointer">Continue</button>
                <p className="text-xs font-semibold mt-5 text-center w-9/12 mx-auto text-black">
                  By continuing, you agree to Pinterest's Terms of Service and acknowledge you've read our Privacy Policy. Notice at collection.
                </p>
              </form>
              <Link className="block text-center text-m font-semibold sm:text-zinc-700 text-white" href="/login">
                Already on Pinterest? <strong>Sign In</strong>
              </Link>
            </div>
          ) : (
            <div id="div2" className="flex flex-col mx-7 items-center h-fit sm:bg-white bg-transparent px-4 md:px-12 py-8 md:py-4 rounded-3xl w-full text-black">
              <span className="flex justify-start px-8 items-center border-b-2 w-[130%]">
                <button type="button" onClick={() => setStep(1)}><i className="ri-arrow-left-line"></i></button>
                <h1 className="py-4 mx-11 w-48 mb-2 text-xl sm:text-black text-white text-center tracking-tight capitalize font-semibold leading-none">
                  Create New Account
                </h1>
              </span>
              {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
              <form className="my-4 w-full" onSubmit={handleSubmit}>
                <input className="block border-2 border-slate-300 bg-slate-200 rounded-xl my-2 w-full px-2 py-2" required type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                <input className="block border-2 rounded-xl border-slate-300 bg-slate-200 mb-1 w-full px-1 py-2" required type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                <input className="block border-2 rounded-xl border-slate-300 bg-slate-200 my-2 w-full px-1 py-2" required type="tel" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} />
                <input className="block border-2 rounded-full my-4 w-full px-1 py-2 bg-red-600 text-white font-bold cursor-pointer" type="submit" value="Confirm" />
                <p className="text-xs font-semibold mt-5 text-center w-9/12 mx-auto text-black">
                  By continuing, you agree to Pinterest's Terms of Service and acknowledge you've read our Privacy Policy. Notice at collection.
                </p>
              </form>
            </div>
          )}
        </span>
      </div>
    </div>
  );
}
