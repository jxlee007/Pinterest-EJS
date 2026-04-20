"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/profile', icon: 'ri-home-fill' },
    { name: 'Explore', href: '/explore', icon: 'ri-compass-3-fill' },
    { name: 'Create', href: '/upload', icon: 'ri-add-circle-fill' },
    { name: 'Profile', href: '/profile', icon: 'ri-user-fill' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <div className="navigation hidden md:flex sticky top-0 z-[400] max-w-full px-5 py-4 items-center gap-5 font-['Gilroy'] text-white glass-dark border-b border-white/5 shadow-lg">
        <div className="logo">
          <Link href="/">
            <svg fill="#e60023" className="w-10" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M0 12a12 12 0 0 0 7.73 11.22 12 12 0 0 1 .03-3.57l1.4-5.94S8.8 13 8.8 11.94c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86a5.17 5.17 0 0 0-5.39 5.18c0 1.03.4 2.13.9 2.73q.12.17.08.34l-.34 1.36q-.06.31-.4.16c-1.49-.7-2.42-2.88-2.42-4.63 0-3.77 2.74-7.23 7.9-7.23 4.14 0 7.36 2.95 7.36 6.9 0 4.12-2.6 7.43-6.2 7.43-1.21 0-2.35-.63-2.74-1.37l-.74 2.84a14 14 0 0 1-1.55 3.23A12 12 0 1 0 0 12"></path>
            </svg>
          </Link>
        </div>

        <div className="links flex gap-5 items-center">
          <Link href="/profile" className={`whitespace-nowrap font-semibold hover:text-gray-300 ${pathname === '/profile' ? 'text-red-500' : ''}`}>Home</Link>
          <Link href="/explore" className={`whitespace-nowrap font-semibold hover:text-gray-300 ${pathname === '/explore' ? 'text-red-500' : ''}`}>Explore</Link>
          <div className="relative whitespace-nowrap font-semibold cursor-pointer group py-2">
            <button
              className="px-2 focus:ring-1 focus:outline-none focus:ring-white font-semibold rounded-lg text-md text-center inline-flex items-center"
              type="button"
            >
              Create
              <svg className="w-2.5 h-2.5 ms-3 transition-transform group-hover:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>

            <div className="z-10 mt-3 absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 glass-dark divide-y divide-white/10 rounded-2xl shadow-2xl w-52 left-0 overflow-hidden border border-white/10 backdrop-blur-xl">
              <ul className="py-2 text-sm text-zinc-100">
                <li>
                  <Link href="/upload" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                    <i className="ri-add-box-line text-lg text-red-500"></i>
                    <span className="font-medium">Create New Post</span>
                  </Link>
                </li>
                <li>
                  <Link href="/profile?action=create-board" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                    <i className="ri-layout-grid-line text-lg text-red-500"></i>
                    <span className="font-medium">Create New Board</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="inputcontainer flex w-full rounded-full bg-white/10 border border-white/10 h-11 items-center focus-within:bg-white/20 focus-within:border-white/20 transition-all duration-300">
          <div className="input w-full relative group h-full flex items-center px-4">
            <i className="ri-search-line text-zinc-400 mr-2"></i>
            <input
              type="text"
              className="bg-transparent outline-none font-medium w-full h-full text-white placeholder:text-zinc-500"
              placeholder="Search for inspiration..."
            />
          </div>
          <Link
            href="/"
            className="flex items-center whitespace-nowrap px-6 h-full rounded-r-full bg-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-600 transition text-sm"
          >
            All Pins
          </Link>
        </div>

        <div className="iconsnpic flex gap-6 items-center">
          {user ? (
            <div className="pic relative group flex flex-row-reverse items-center whitespace-nowrap font-semibold cursor-pointer py-2">
              <button
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

              <div className="z-20 right-0 top-14 absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 overflow-hidden glass-dark border border-white/10 rounded-2xl shadow-2xl w-48">
                <ul className="py-2 text-sm text-zinc-100">
                  <li className="px-4 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Account</p>
                  </li>
                  <li>
                    <Link href="/edit" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                      <i className="ri-settings-3-line text-lg text-zinc-400"></i>
                      <span>Edit Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-400 transition-colors">
                      <i className="ri-logout-box-r-line text-lg"></i>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="guest-options relative group py-2">
              <button
                className="cursor-pointer flex justify-between items-center w-24 gap-2 text-white font-semibold focus:outline-none"
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
              <div className="z-20 right-0 top-14 absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 overflow-hidden glass-dark border border-white/10 rounded-2xl shadow-2xl w-48">
                <ul className="py-2 text-sm text-zinc-100">
                  <li>
                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                      <i className="ri-login-box-line text-lg text-zinc-400"></i>
                      <span>Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors">
                      <i className="ri-user-add-line text-lg text-zinc-400"></i>
                      <span>Register</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center px-4 py-3 text-white sticky top-0 z-[400] glass-dark border-b border-zinc-800/50">
        <div className="logo">
          <Link href="/">
            <svg fill="#e60023" className="w-8" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M0 12a12 12 0 0 0 7.73 11.22 12 12 0 0 1 .03-3.57l1.4-5.94S8.8 13 8.8 11.94c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.98-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86a5.17 5.17 0 0 0-5.39 5.18c0 1.03.4 2.13.9 2.73q.12.17.08.34l-.34 1.36q-.06.31-.4.16c-1.49-.7-2.42-2.88-2.42-4.63 0-3.77 2.74-7.23 7.9-7.23 4.14 0 7.36 2.95 7.36 6.9 0 4.12-2.6 7.43-6.2 7.43-1.21 0-2.35-.63-2.74-1.37l-.74 2.84a14 14 0 0 1-1.55 3.23A12 12 0 1 0 0 12"></path>
            </svg>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2"><i className="ri-search-line text-xl"></i></button>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2"
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu (Hamburger) */}
      <div className={`md:hidden fixed inset-0 z-[500] transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        
        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-4/5 max-w-xs glass-dark shadow-2xl transition-transform duration-500 ease-in-out transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-bold font-['Gilroy']">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="size-14 bg-zinc-400 rounded-full overflow-hidden border-2 border-red-500/50">
                  {user.profileImage ? (
                    <Image src={`http://localhost:5000/images/uploads/${user.profileImage}`} alt="profile" width={56} height={56} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-black font-bold text-2xl">{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-xl tracking-tight">{user.username}</p>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-sm text-zinc-400 hover:text-red-400 transition-colors">View Profile</Link>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => {
                if (link.name === 'Create') {
                  return (
                    <div key="create-mobile" className="flex flex-col gap-1">
                      <div className="flex items-center gap-4 p-4 text-zinc-500 text-xs uppercase font-bold tracking-widest mt-2">
                        Create
                      </div>
                      <Link 
                        href="/upload"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${pathname === '/upload' ? 'bg-red-600 text-white' : 'hover:bg-zinc-800 text-zinc-300'}`}
                      >
                        <i className="ri-add-box-line text-xl"></i>
                        <span className="font-semibold">Create Post</span>
                      </Link>
                      <Link 
                        href="/profile?action=create-board"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${pathname === '/profile' && false ? 'bg-red-600 text-white' : 'hover:bg-zinc-800 text-zinc-300'}`}
                      >
                        <i className="ri-layout-grid-line text-xl"></i>
                        <span className="font-semibold">Create Board</span>
                      </Link>
                    </div>
                  );
                }
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${pathname === link.href ? 'bg-red-600 text-white' : 'hover:bg-zinc-800 text-zinc-300'}`}
                  >
                    <i className={`${link.icon} text-xl`}></i>
                    <span className="font-semibold">{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-zinc-800">
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 w-full rounded-xl hover:bg-red-600/10 text-red-500 transition-colors"
                >
                  <i className="ri-logout-box-r-line text-xl"></i>
                  <span className="font-semibold">Logout</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-zinc-800 text-zinc-300"
                  >
                    <i className="ri-login-box-line text-xl"></i>
                    <span className="font-semibold">Login</span>
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-zinc-800 text-zinc-300"
                  >
                    <i className="ri-user-add-line text-xl"></i>
                    <span className="font-semibold">Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
