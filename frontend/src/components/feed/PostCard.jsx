"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function PostCard({ post, onDelete, showDelete }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="card-container break-inside-avoid mb-4 group relative">
      <Link href={`/post/${post._id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-zinc-800 transition-all duration-300 group-hover:brightness-90">
          <Image
            src={`http://localhost:5000/images/uploads/${post.postImage}`}
            alt={post.title}
            width={400}
            height={500}
            className="w-full h-auto object-cover"
            unoptimized
          />
          
          {/* Hover Overlay for Desktop */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-start justify-end p-3 opacity-0 group-hover:opacity-100">
             {showDelete && (
                <button
                  onClick={(e) => { e.preventDefault(); onDelete(post._id); }}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  title="Delete Post"
                >
                  <i className="ri-delete-bin-line text-lg"></i>
                </button>
              )}
          </div>
        </div>
        
        <div className="mt-2 px-2">
          <h6 className="text-sm font-semibold text-zinc-100 truncate">{post.title}</h6>
          <div className="flex items-center gap-2 mt-1">
            <div className="size-5 rounded-full bg-zinc-600 flex items-center justify-center text-[10px] font-bold overflow-hidden">
               {post.user?.profileImage ? (
                 <Image src={`http://localhost:5000/images/uploads/${post.user.profileImage}`} alt="user" width={20} height={20} unoptimized />
               ) : (
                 <span>{post.user?.username?.charAt(0).toUpperCase() || 'U'}</span>
               )}
            </div>
            <span className="text-xs text-zinc-400">{post.user?.username || 'User'}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
