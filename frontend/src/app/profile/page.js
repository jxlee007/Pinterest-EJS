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
    <div className="profile w-full min-h-screen bg-zinc-800 text-white pt-1 relative">
      <div className='profdets flex flex-col items-center mt-10'>
        <div className="relative">
          <label htmlFor="fileInput" className="cursor-pointer w-10 h-10 absolute bottom-0 right-0 rounded-full flex items-center justify-center bg-zinc-200 z-10">
             <span className="text-zinc-800 text-xl">&#9998;</span> {/* Pencil icon replacement */}
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
        <Link href="/edit" className="mt-4 px-4 py-2 bg-zinc-600 rounded-full text-sm font-semibold hover:bg-zinc-500">Edit Profile</Link>
      </div>

      <div className="flex justify-center mt-4">
        <button onClick={() => setShowBoardModal(true)} className="px-4 py-2 bg-red-600 rounded-full text-white font-semibold hover:bg-red-700">
          Create New Board
        </button>
      </div>

      <div className="boards flex flex-wrap justify-center gap-10 px-10 mt-10 pb-10">
          {profile.boards && profile.boards.map(board => (
              <Link key={board._id} href={`/show/board/${board._id}`} className="board flex flex-col relative w-52">
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
                         <span className="text-gray-500">Empty</span>
                      )}
                  </div>
                  <div className="flex flex-row justify-between items-center mt-3">
                      <span>
                          <h3 className="text-xl font-semibold truncate w-32">{board.name}</h3>
                          <h5 className="text-sm font-medium opacity-60">
                              {(board.posts && board.posts.length) || 0} Pins
                          </h5>
                      </span>
                      <button
                        onClick={(e) => handleDeleteBoard(e, board._id)}
                        className="delete-board z-10 px-2 py-1 rounded-full bg-red-600 text-white font-semibold text-sm hover:bg-red-700"
                      >
                          Delete
                      </button>
                  </div>
              </Link>
          ))}

          {(!profile.boards || profile.boards.length === 0) && (
             <p className="text-gray-400">No boards created yet.</p>
          )}
      </div>

      {showBoardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleCreateBoard} className="bg-white text-black w-1/3 p-6 rounded-3xl">
              <h1 className="text-2xl mb-2 font-semibold">Create New Board</h1>
              <hr className="border-gray-300 mb-6" />

              <label htmlFor="boardname" className="block mb-2 font-medium">Board Name</label>
              <input
                type="text"
                id="boardname"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="w-full bg-gray-200 border-transparent rounded-lg text-sm px-4 py-3 mb-8 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter name"
                required
              />

              <div className="flex justify-end gap-3">
                  <button type="submit" className="bg-red-600 hover:bg-red-700 rounded-full text-white py-2 px-6 font-semibold transition">Save</button>
                  <button type="button" onClick={() => setShowBoardModal(false)} className="bg-gray-500 hover:bg-gray-600 rounded-full text-white py-2 px-6 font-semibold transition">Cancel</button>
              </div>
          </form>
        </div>
      )}

    </div>
  );
}
