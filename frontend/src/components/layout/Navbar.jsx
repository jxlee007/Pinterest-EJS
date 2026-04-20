"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [createDropdown, setCreateDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [guestDropdown, setGuestDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navigation relative z-[333] max-w-full px-5 py-4 flex items-center gap-5 font-['Gilroy'] text-white bg-[#27272a]">
      <div className="logo">
        <Link href="/">
          <svg fill="#e60023" className="w-10" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
            <path d="M0 12a12 12 0 0 0 7.73 11.22 12 12 0 0 1 .03-3.57l1.4-5.94S8.8 13 8.8 11.94c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86a5.17 5.17 0 0 0-5.39 5.18c0 1.03.4 2.13.9 2.73q.12.17.08.34l-.34 1.36q-.06.31-.4.16c-1.49-.7-2.42-2.88-2.42-4.63 0-3.77 2.74-7.23 7.9-7.23 4.14 0 7.36 2.95 7.36 6.9 0 4.12-2.6 7.43-6.2 7.43-1.21 0-2.35-.63-2.74-1.37l-.74 2.84a14 14 0 0 1-1.55 3.23A12 12 0 1 0 0 12"></path>
          </svg>
        </Link>
      </div>

      <div className="links flex gap-5 items-center">
        <Link href="/profile" className="whitespace-nowrap font-semibold hover:text-gray-300">Home</Link>
        <Link href="/explore" className="whitespace-nowrap font-semibold hover:text-gray-300">Explore</Link>
        <div className="relative whitespace-nowrap font-semibold cursor-pointer">
          <button
            onClick={() => { setCreateDropdown(!createDropdown); setProfileDropdown(false); setGuestDropdown(false); }}
            className="px-2 focus:ring-1 focus:outline-none focus:ring-white font-semibold rounded-lg text-md text-center inline-flex items-center"
            type="button"
          >
            Create
            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>

          {createDropdown && (
            <div className="z-10 mt-8 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <Link href="/upload" onClick={() => setCreateDropdown(false)} className="block px-4 py-2 hover:bg-gray-100">Create New Post</Link>
                </li>
                <li>
                  <Link href="/profile" onClick={() => setCreateDropdown(false)} className="block px-4 py-2 hover:bg-gray-100">Create New Board</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="inputcontainer flex w-full rounded-full bg-zinc-200 h-12 items-center">
        <div className="input w-full relative group h-full">
          <input
            type="text"
            className="bg-transparent outline-none px-5 font-semibold w-full h-full rounded-l-full text-black"
            placeholder="Search Pizza, 3d Designs or what not..."
          />
        </div>
        <Link
          href="/"
          className="flex items-center whitespace-nowrap px-5 h-full rounded-r-full bg-slate-500 font-semibold hover:bg-zinc-300 hover:text-slate-500 text-sm border-l-2 border-zinc-300 transition"
        >
          All Pins
        </Link>
      </div>

      <div className="iconsnpic flex gap-6 items-center">
        {user ? (
          <div className="pic relative flex flex-row-reverse items-center whitespace-nowrap font-semibold cursor-pointer">
            <button
              onClick={() => { setProfileDropdown(!profileDropdown); setCreateDropdown(false); setGuestDropdown(false); }}
              className="text-gray-300 bg-white bg-opacity-25 py-1 px-2 pl-3 focus:ring-1 focus:outline-none focus:ring-white font-semibold rounded-3xl text-lg text-center inline-flex items-center"
              type="button"
            >
              <span>{user.username}</span>
              <div className="size-8 ml-3 bg-zinc-400 rounded-full overflow-hidden">
                {user.profileImage ? (
                  <Image src={`http://localhost:5000/images/uploads/${user.profileImage}`} alt="profile" width={32} height={32} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-black font-bold">{user.username.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </button>

            {profileDropdown && (
              <div className="z-10 right-0 top-12 absolute overflow-hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-28">
                <ul className="py-1 text-sm text-gray-700">
                  <li>
                    <Link href="/edit" onClick={() => setProfileDropdown(false)} className="block px-4 py-2 hover:bg-gray-100">Edit Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="guest-options relative">
            <button
              onClick={() => { setGuestDropdown(!guestDropdown); setCreateDropdown(false); setProfileDropdown(false); }}
              className="cursor-pointer flex justify-between items-center w-24 gap-2 text-white font-semibold"
            >
              Guest
              <Image
                width={32} height={32}
                className="size-8 bg-white rounded-3xl"
                src="https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"
                alt="guest"
                unoptimized
              />
            </button>
            {guestDropdown && (
              <div className="absolute right-0 mt-5 w-32 origin-top-right bg-gray-700 divide-y rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <Link href="/login" onClick={() => setGuestDropdown(false)} className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-gray-900">Login</Link>
                  <Link href="/register" onClick={() => setGuestDropdown(false)} className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-gray-900">Register</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
