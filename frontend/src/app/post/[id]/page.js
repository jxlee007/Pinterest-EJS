"use client";

import { useEffect, useState } from 'react';
import { postApi } from '@/services/post.api';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center mt-20 text-white">Loading...</div>;
  if (!post) return <div className="text-center mt-20 text-white">Post not found.</div>;

  return (
    <div className="container mx-auto px-10 py-8 flex justify-center">
      <div className="bg-white rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-4xl w-full text-black">
        <div className="w-full md:w-1/2">
          <Image
            src={`http://localhost:5000/images/uploads/${post.postImage}`}
            alt={post.title}
            width={600}
            height={600}
            className="object-cover w-full h-full min-h-[400px]"
            unoptimized
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-700 mb-6">{post.desc}</p>
          <div className="flex items-center gap-3">
            {post.user && (
              <>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                  {post.user.profileImage ? (
                    <Image
                      src={`http://localhost:5000/images/uploads/${post.user.profileImage}`}
                      alt={post.user.username}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold">
                      {post.user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="font-semibold">{post.user.username}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
