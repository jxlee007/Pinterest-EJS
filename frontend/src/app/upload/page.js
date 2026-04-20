"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { postApi } from '@/services/post.api';
import { userApi } from '@/services/user.api';

export default function AddPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [board, setBoard] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, loading, router]);

  const fetchProfile = async () => {
    try {
      const res = await userApi.getProfile();
      setBoards(res.data.user.boards || []);
      if (res.data.user.boards && res.data.user.boards.length > 0) {
        setBoard(res.data.user.boards[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc || !image || !board) {
      alert('Please fill all the fields');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('board', board);
    formData.append('postimage', image);

    try {
      await postApi.createPost(formData);
      router.push('/profile');
    } catch (error) {
      console.error('Failed to create post', error);
      alert('Failed to create post');
    }
  };

  if (loading || !user) return null;

  return (
    <div className="w-full min-h-[calc(100vh-60px)] bg-slate-500 px-10 py-5 absolute z-0 left-0 top-[72px]">
      <h1 className="text-xl text-white"> Create New Pin</h1>
      <h2 className="text-sm text-white">Working on: My Uploaded Pins</h2>
      <hr className="h-2 mt-3" />

      <form id="myForm" onSubmit={handleSubmit} className="p-4 flex justify-center items-center">
        <div className="h-max grid sm:grid-cols-2 grid-rows gap-16 justify-items-center">
          <div className="px-1 w-[400px] h-full bg-neutral-300 border-2 border-neutral-500 border-dashed rounded-2xl flex flex-col justify-center items-center">
            <span className="my-4 flex flex-col items-center">
              <label htmlFor="fileInput" id="uploadIcon" className="cursor-pointer">
                <img src="/images/arrow-up-circle-fill.svg" alt="Upload icon" className="w-14 h-14 bg-white rounded-full opacity-70" />
              </label>
              <input type="file" name="postimage" id="fileInput" className="hidden" onChange={handleImageChange} accept="image/*" />
              <p id="fileMessage" className="text-black mt-2">{image ? `File selected: ${image.name}` : 'Choose a file'}</p>
            </span>

            <span className="border-dashed border-neutral-500 border-2 rounded-2xl mt-2 mb-1 p-4 w-full h-5/6 flex flex-col items-center justify-center">
              {preview ? (
                <img id="previewImage" src={preview} alt="Preview" className="w-48 h-56 object-cover rounded-md" />
              ) : (
                <>
                  <img id="previewImage" alt="" className="w-48 h-56 overflow-hidden rounded-md hidden" />
                  <p id="hidetxt" className="text-sm text-center text-black">We recommend using high quality .jpg files less than 20 MB or .mp4 files less than 200 MB.</p>
                </>
              )}
            </span>
          </div>

          <div className="w-full h-full flex flex-col">
            <label className="text-white" htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="px-3 py-2 border-2 mb-3 rounded-lg text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="text-white" htmlFor="desc">Description</label>
            <textarea
              name="desc"
              placeholder="Description"
              className="px-3 py-2 border-2 mb-3 rounded-lg h-28 text-black"
              cols="30"
              rows="10"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>

            <label className="text-white" htmlFor="board">Board:</label>
            <select
              name="board"
              id="board"
              className="px-3 py-2 border-2 mb-3 rounded-lg text-black"
              value={board}
              onChange={(e) => setBoard(e.target.value)}
            >
              <option value="" disabled>Select a board</option>
              {boards.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>

            <input type="submit" value="Create Post" className="px-3 py-2 border-2 mt-2 rounded-full bg-red-700 text-white font-bold cursor-pointer hover:bg-red-800 transition" />
          </div>
        </div>
      </form>
    </div>
  );
}
