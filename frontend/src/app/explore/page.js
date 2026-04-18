"use client";

import { useEffect, useState } from 'react';
import api from '@/services/api';
import PostCard from '@/components/feed/PostCard';

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExplore();
  }, []);

  const fetchExplore = async () => {
    try {
      const res = await api.get('/api/explore');
      setPosts(res.data.posts);
    } catch (error) {
      console.error('Failed to fetch explore feed', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-10 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Explore</h1>
      <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      {posts.length === 0 && <p className="text-gray-400">No posts to explore.</p>}
    </div>
  );
}
