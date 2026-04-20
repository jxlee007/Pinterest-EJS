"use client";

import { useEffect, useState } from 'react';
import { postApi } from '@/services/post.api';
import Image from 'next/image';
import Link from 'next/link';

export default function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await postApi.getFeed(1, 50); // Get a good chunk of posts
      setPosts(res.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;

  return (
    <div className="container mx-auto px-10 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="relative">
              <Link href={`/post/${post._id}`}>
                <div
                  className="bg-cover bg-center h-64 rounded-xl relative overflow-hidden"
                  style={{ backgroundImage: `url('http://localhost:5000/images/uploads/${post.postImage}')` }}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-70 rounded-b-xl">
                    <span className="flex justify-between">
                      <h5 className="text-white text-sm mb-2">{post.title}</h5>
                      <h5 className="text-white text-sm mb-2">{formatDate(post.createdAt)}</h5>
                    </span>
                    <span className="flex justify-between">
                      <h6 className="text-gray-300">@{post.user?.username || 'Unknown'}</h6>
                      <h6 className="text-gray-300">{post.board ? post.board.name : 'No Board'}</h6>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-white">No posts available.</p>
        )}
      </div>
    </div>
  );
}
