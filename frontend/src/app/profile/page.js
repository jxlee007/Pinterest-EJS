"use client";

import { useEffect, useState, Suspense } from 'react';
import { userApi } from '@/services/user.api';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-white">Loading Profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create-board') {
      setShowBoardModal(true);
    }
  }, [searchParams]);

  const fetchProfile = async () => {
    try {
      const res = await userApi.getProfile();
      setProfile(res.data.user);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
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

  const [showBoardModal, setShowBoardModal] = useState(false);
  const [boardName, setBoardName] = useState('');

  const handleDeleteBoard = async (e, boardId) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this board?')) {
      try {
        await userApi.deleteBoard(boardId);
        fetchProfile();
      } catch (error) {
        console.error('Failed to delete board', error);
        alert('Failed to delete board');
      }
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!boardName) return;
    try {
      await userApi.createBoard({ boardname: boardName });
      setBoardName('');
      setShowBoardModal(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to create board', error);
      alert('Failed to create board');
    }
  };

  if (authLoading || loading) return <div className="text-center mt-20 text-white">Loading...</div>;
  if (!user || !profile) return null;

  return (
    <div className="profile w-full min-h-[calc(100vh-60px)] bg-zinc-800 text-white pt-1 relative">
      <div className='profdets flex flex-col items-center mt-10'>
        <div className="relative">
          <label htmlFor="fileInput" className="cursor-pointer w-10 h-10 absolute bottom-0 right-0 rounded-full flex items-center justify-center bg-zinc-200 z-10">
            <i className="text-zinc-800 ri-pencil-fill"></i>
          </label>
          <input type="file" id="fileInput" className="hidden" onChange={handleImageUpload} />

          <div className="w-32 h-32 bg-zinc-200 rounded-full overflow-hidden flex items-center justify-center">
            {profile.profileImage ? (
              <Image
                src={`http://localhost:5000/images/uploads/${profile.profileImage}`}
                alt="profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-4xl font-bold text-gray-500">{profile.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-semibold mt-5">
            {profile.fullname || profile.username}
        </h1>
        <h3 className="text-md mt-2">@{profile.username}</h3>
      </div>

      <div className="boards flex flex-wrap gap-10 px-10 mt-10">
          {profile.boards && profile.boards.map(board => (
              <Link key={board._id} href={`/show/board/${board._id}`} className="board flex flex-col relative">
                  <div className="w-52 h-40 bg-zinc-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {board.posts && board.posts.length > 0 ? (
                          <Image
                            className="h-full w-full object-cover"
                            src={`http://localhost:5000/images/uploads/${board.posts[0].postImage}`}
                            alt={board.name}
                            width={208}
                            height={160}
                            unoptimized
                          />
                      ) : (
                         <span className="text-gray-500"></span>
                      )}
                  </div>
                  <div className="flex flex-row justify-between">
                      <span>
                          <h3 className="text-xl font-semibold mt-3">{board.name}</h3>
                          <h5 className="text-sm font-medium opacity-60">
                              {(board.posts && board.posts.length) || 0} Pins
                          </h5>
                      </span>
                      <button
                        onClick={(e) => handleDeleteBoard(e, board._id)}
                        className="delete-board z-10 px-2 py-1 rounded-full bg-red-600 text-3xl font-semibold mt-3"
                      >
                          <i className="ri-delete-bin-7-line"></i>
                      </button>
                  </div>
              </Link>
          ))}
      </div>

      {showBoardModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-0 md:p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
            onClick={() => setShowBoardModal(false)}
          ></div>
          
          {/* Modal / Bottom Sheet */}
          <form 
            onSubmit={handleCreateBoard} 
            className="relative w-full md:max-w-md bg-zinc-900 md:bg-white text-white md:text-black p-8 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl animate-slide-up md:animate-scale-in self-end md:self-center border-t border-white/10 md:border-none"
          >
              <div className="w-12 h-1.5 bg-zinc-700 md:hidden rounded-full mx-auto mb-6 opacity-50"></div>
              
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-2xl font-bold font-['Gilroy'] tracking-tight">Create Board</h1>
                <button type="button" onClick={() => setShowBoardModal(false)} className="hidden md:flex text-zinc-400 hover:text-black transition-colors p-2">
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="boardname" className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block ml-1">Board Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="boardname"
                      value={boardName}
                      onChange={(e) => setBoardName(e.target.value)}
                      className="py-5 px-6 ps-14 block w-full bg-zinc-800 md:bg-zinc-100 border-transparent rounded-[1.5rem] text-lg focus:ring-2 focus:ring-red-500 transition-all outline-none text-white md:text-black placeholder:text-zinc-600"
                      placeholder="e.g., Summer Vibes 2024"
                      autoFocus
                      required
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-6">
                      <i className="ri-layout-grid-line text-zinc-500 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
                    >
                      Create Board
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowBoardModal(false)} 
                      className="w-full bg-zinc-800 md:bg-zinc-100 hover:bg-zinc-700 md:hover:bg-zinc-200 text-zinc-300 md:text-zinc-800 font-bold py-5 px-8 rounded-2xl transition-all"
                    >
                      Cancel
                    </button>
                </div>
              </div>
          </form>
        </div>
      )}

      {/* Button to open the create board modal */}
      <div className="fixed bottom-10 right-10">
        <button onClick={() => setShowBoardModal(true)} className="w-14 h-14 bg-red-600 rounded-full text-white text-3xl shadow-lg hover:bg-red-700 flex items-center justify-center transition-transform active:scale-90">
          +
        </button>
      </div>

    </div>
  );
}
