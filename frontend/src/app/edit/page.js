"use client";

import { useState, useEffect } from 'react';
import { userApi } from '@/services/user.api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    phone: '',
  });
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
      setProfile(res.data.user);
      setFormData({
        username: res.data.user.username || '',
        email: res.data.user.email || '',
        fullname: res.data.user.fullname || '',
        phone: res.data.user.contact || '',
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
      await userApi.editProfile(formData);
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    }
  };

  const handleImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const imgData = new FormData();
      imgData.append('profile-image', e.target.files[0]);
      try {
        await userApi.uploadProfileImage(imgData);
        fetchProfile(); // reload profile to show new image
      } catch (error) {
        console.error('Failed to upload image', error);
        alert('Failed to upload image.');
      }
    }
  };

  if (authLoading || loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || !profile) return null;

  return (
    <div className="w-full min-h-screen bg-zinc-800 px-10 py-5">
      <div className="w-full flex justify-between items-center mb-8">
        <h1 className="text-xl text-white">Edit Profile</h1>
        <Link href="/profile" className="px-3 py-2 bg-red-700 text-white rounded-md">Cancel</Link>
      </div>
      <hr className="mb-8 border-gray-600" />

      <div className="flex flex-col items-center">
        <p className="text-white mb-4">Edit Profile Image</p>
        <div className="relative mb-8">
          <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-500 flex items-center justify-center text-3xl text-white font-bold mb-2">
               {profile.profileImage ? (
                  <Image
                    src={`http://localhost:5000/images/uploads/${profile.profileImage}`}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  profile.username.charAt(0).toUpperCase()
                )}
            </div>
            <span className="text-blue-400 text-sm">Change picture</span>
          </label>
          <input type="file" id="fileInput" className="hidden" onChange={handleImageUpload} />
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="px-3 py-2 border-2 rounded-lg text-black bg-white"
          />
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            className="px-3 py-2 border-2 rounded-lg text-black bg-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="px-3 py-2 border-2 rounded-lg text-black bg-white"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Contact Number"
            value={formData.phone}
            onChange={handleChange}
            className="px-3 py-2 border-2 rounded-lg text-black bg-white"
          />

          <button type="submit" className="mt-4 px-3 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
