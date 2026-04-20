"use client";

import { useEffect, useState } from 'react';
import { postApi } from '@/services/post.api';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ShowPostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await postApi.getPost(id);
      setPost(res.data.post);
    } catch (error) {
      console.error('Failed to fetch post', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;
  if (!post) return <div className="text-center mt-20 text-white">Post not found.</div>;

  return (
    <div className="container mx-auto px-10 py-8 bg-white text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Post Details</h1>
      <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="w-full md:w-1/2">
              <Image
                src={`http://localhost:5000/images/uploads/${post.postImage}`}
                alt="Post Image"
                className="w-full rounded-lg mb-4 object-cover"
                width={800}
                height={600}
                unoptimized
              />
              {/* Using desc as content since post schema usually has desc */}
              <p className="text-gray-600">{post.desc}</p>
          </div>
          <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-4">{post.title} post</h2>
              <p className="text-gray-800 mb-4">{post.desc}</p>
              <p className="text-gray-600">Author: {post.user?.username || 'Unknown'}</p>
              <p className="text-gray-600">Published on: {formatDate(post.createdAt)}</p>
          </div>
      </div>
    </div>
  );
}
