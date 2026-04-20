"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function PostCard({ post, onDelete, showDelete }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="card relative bg-white rounded-lg overflow-hidden group">
      <Link href={`/post/${post._id}`}>
        <Image
          src={`http://localhost:5000/images/uploads/${post.postImage}`}
          alt="image"
          width={400}
          height={300}
          className="h-64 w-full object-cover"
          unoptimized
        />
        <div className="flex justify-between bg-black bg-opacity-40 text-white -mt-16 px-4 py-1.5 rounded-b-lg absolute w-full bottom-0">
          <span>
            <h6 className="mt-2 text-sm">{post.title}</h6>
            <h5 className="text-xs">{formatDate(post.createdAt)}</h5>
          </span>
          {showDelete && (
            <span onClick={(e) => e.preventDefault()}>
              <button
                onClick={(e) => { e.preventDefault(); onDelete(post._id); }}
                className="delete-post bg-red-600 hover:text-red-600 text-sm hover:bg-slate-100 border border-slate-200 rounded-lg font-medium px-4 py-2 mt-1 inline-flex space-x-1 items-center z-10 relative"
              >
                <span className="w-4 h-4 text-current">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </span>
                <span>Delete</span>
              </button>
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
