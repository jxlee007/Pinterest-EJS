"use client";

import { useEffect, useState } from 'react';
import { userApi } from '@/services/user.api';
import { useParams, useRouter } from 'next/navigation';
import PostCard from '@/components/feed/PostCard';
import { useAuth } from '@/context/AuthContext';

export default function BoardDetailPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (id && user) {
      fetchBoard();
    }
  }, [id, user]);

  const fetchBoard = async () => {
    try {
      const res = await userApi.getBoard(id);
      setBoard(res.data.board);
    } catch (error) {
      console.error('Failed to fetch board', error);
      router.push('/profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <div className="text-center mt-20 text-white">Loading...</div>;
  if (!board) return null;

  return (
    <div className="w-full min-h-screen bg-zinc-800 px-10 py-8 text-white">
        <h1 className="text-3xl font-bold mb-6">{board.name}</h1>
        <div className="cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {board.posts.map(post => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
        {board.posts.length === 0 && <p className="text-gray-400">No posts in this board.</p>}
    </div>
  );
}
