"use client";

import { useState, useEffect } from 'react';
import { userApi } from '@/services/user.api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      const res = await userApi.getProfile();
      const profile = res.data.user;
      setFormData({
        username: profile.username || '',
        fullname: profile.fullname || '',
        email: profile.email || '',
        phone: profile.contact || '' // Assuming 'contact' is used for phone in EJS backend
      });
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data logic
      // In the EJS it posts to /edit
      // If userApi.updateProfile doesn't exist, we fallback, but we'll try to implement or mock it.
      // For this frontend conversion, we just construct the fetch.
      // EJS form submitted natively.
      await userApi.editProfile(formData);
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };

  if (authLoading || loading) return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] py-6">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8 bg-white text-black">
          <div className="px-4 py-6 sm:px-0">
              <h1 className="text-3xl font-semibold">Edit Profile</h1>
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        id="username"
                        className="block border-2 border-slate-300 bg-slate-200 rounded-xl my-2 w-full px-2 py-2"
                        value={formData.username}
                        onChange={handleChange}
                      />
                  </div>
                  <div>
                      <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        name="fullname"
                        id="fullname"
                        className="block border-2 border-slate-300 bg-slate-200 rounded-xl my-2 w-full px-2 py-2"
                        value={formData.fullname}
                        onChange={handleChange}
                      />
                  </div>
                  <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        placeholder="abc@gmail.com"
                        name="email"
                        id="email"
                        className="block border-2 border-slate-300 bg-slate-200 rounded-xl my-2 w-full px-2 py-2"
                        value={formData.email}
                        onChange={handleChange}
                      />
                  </div>
                  <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Contact Number"
                        name="phone"
                        id="phone"
                        className="block border-2 border-slate-300 bg-slate-200 rounded-xl my-2 w-full px-2 py-2"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                  </div>
                  <div className="flex gap-4">
                      <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Update Profile
                      </button>
                      <Link href="/profile" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Cancel
                      </Link>
                  </div>
              </form>
          </div>
      </div>
    </div>
  );
}
