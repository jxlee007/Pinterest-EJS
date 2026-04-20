"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { postApi } from '@/services/post.api';
import PostCard from '@/components/feed/PostCard.jsx';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const observer = useRef();
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchFeed(page);
    }
  }, [user, page]);

  const fetchFeed = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await postApi.getFeed(pageNumber, 10);
      const newPosts = res.data.posts;
      setPosts(prev => {
        // Prevent duplicates in case strict mode double-fires
        const existingIds = new Set(prev.map(p => p._id));
        const filtered = newPosts.filter(p => !existingIds.has(p._id));
        return [...prev, ...filtered];
      });
      if (newPosts.length === 0 || newPosts.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch feed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await postApi.deletePost(id);
      setPosts((prev) => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Failed to delete post', error);
      alert('Failed to delete');
    }
  };

  if (authLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!user) return null; // redirecting

  return (
    <div className="container mx-auto px-10 py-8 text-white">
      <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return <div ref={lastPostElementRef} key={post._id}><PostCard post={post} onDelete={handleDelete} showDelete={true} /></div>
          } else {
            return <PostCard key={post._id} post={post} onDelete={handleDelete} showDelete={true} />
          }
        })}
      </div>
      {loading && <p className="text-center text-gray-400 mt-4">Loading more posts...</p>}
      {!loading && posts.length === 0 && <p className="text-gray-400">No posts yet.</p>}
      {!loading && posts.length > 0 && !hasMore && <p className="text-center text-gray-400 mt-4">You have seen all posts.</p>}
    </div>
  );
}
