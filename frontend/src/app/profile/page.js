"use client";

import { useEffect, useState } from 'react';
import { userApi } from '@/services/user.api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
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
        <div id="board" className="absolute inset-y-0 bg-black/50 w-full flex items-center justify-center z-50">
          <form onSubmit={handleCreateBoard} className="bg-white text-black border-2 border-black -mt-40 w-1/3 p-4 rounded-3xl">
              <h1 className="text-2xl mb-2">Create New Board</h1>
              <hr className="border-1 border-black mb-6" />

              <label htmlFor="boardname" className="m-2 block">Board Name</label>
              <div className="relative mb-12">
                <input
                  type="text"
                  id="boardname"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="peer py-3 px-4 ps-11 block w-full bg-gray-200 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none outline-none"
                  placeholder="Enter name"
                  required
                />
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                  <svg className="flex-shrink-0 w-4 h-4 text-black" width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>

              <div className="gap-3 flex justify-end">
                  <button type="submit" className="bg-red-700 rounded-full text-white py-2 px-6">Save</button>
                  <button type="button" onClick={() => setShowBoardModal(false)} className="bg-red-700 rounded-full text-white py-2 px-6">Cancel</button>
              </div>
          </form>
        </div>
      )}

      {/* Button to open the create board modal, we place it somewhere accessible or let the Navbar 'Create Board' open it. We'll add a floating button for easy access matching original layout expectation if needed, or rely on Navbar. Let's add a simple one just in case */}
      <div className="fixed bottom-10 right-10">
        <button onClick={() => setShowBoardModal(true)} className="w-14 h-14 bg-red-600 rounded-full text-white text-3xl shadow-lg hover:bg-red-700 flex items-center justify-center">
          +
        </button>
      </div>

    </div>
  );
}
