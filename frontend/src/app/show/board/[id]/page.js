"use client";

import { useEffect, useState } from 'react';
import { userApi } from '@/services/user.api';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ShowBoardPage() {
  const { user, loading: authLoading } = useAuth();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && id) {
      fetchBoard();
    }
  }, [user, authLoading, router, id]);

  const fetchBoard = async () => {
    try {
      const res = await userApi.getBoard(id);
      setBoard(res.data.board);
    } catch (error) {
      console.error('Failed to fetch board', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <div className="text-center mt-20 text-white">Loading...</div>;
  if (!user || !board) return <div className="text-center mt-20 text-white">Board not found.</div>;

  return (
    <div className="w-full min-h-[calc(100vh-60px)] bg-zinc-800 px-10 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">{board.name}</h1>
      <div className="cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {board.posts && board.posts.length > 0 ? (
            board.posts.map(post => (
              <Link key={post._id} href={`/post/${post._id}`}>
                <div className="card relative rounded-lg overflow-hidden shadow-md cursor-pointer h-48 bg-zinc-700" >
                    <Image
                      className="w-full h-full object-cover"
                      src={`http://localhost:5000/images/uploads/${post.postImage}`}
                      alt={post.title}
                      width={300}
                      height={200}
                      unoptimized
                    />
                    <div className="p-4 absolute bottom-0 w-full bg-black bg-opacity-70">
                        <h5 className="text-lg font-bold mb-2 truncate text-white">{post.title}</h5>
                        <p className="text-sm font-medium text-gray-300 truncate">{post.desc}</p>
                    </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">No posts in this board yet.</p>
          )}
      </div>
    </div>
  );
}
