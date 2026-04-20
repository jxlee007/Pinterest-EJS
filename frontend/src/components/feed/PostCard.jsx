import Image from 'next/image';
import Link from 'next/link';

export default function PostCard({ post, onDelete, showDelete = false }) {
  // Use postImage from backend uploads
  const BACKEND_URL = "http://localhost:5000";
  const imageUrl = post.postImage 
    ? `${BACKEND_URL}/images/uploads/${post.postImage}`
    : "/placeholder.png";

  return (
    <div className="card relative bg-white rounded-lg overflow-hidden group">
      <Link href={`/post/${post._id}`}>
        <Image
          src={imageUrl}
          alt={post.title || "Post image"}
          width={400}
          height={300}
          className="h-64 w-full object-cover cursor-pointer"
          unoptimized
        />
      </Link>

      <div className="flex justify-between items-center bg-black bg-opacity-60 text-white px-4 py-2 absolute bottom-0 w-full opacity-0 group-hover:opacity-100 transition-opacity">
        <div>
          <h6 className="mt-2 text-sm font-semibold truncate w-40">{post.title || "Untitled"}</h6>
          {/* <h5 className="text-xs text-gray-300">{new Date(post.createdAt).toLocaleDateString()}</h5> */}
        </div>

        {showDelete && onDelete && (
          <button
            onClick={() => onDelete(post._id)}
            className="delete-post bg-red-600 hover:text-red-600 text-xs hover:bg-slate-100 border border-slate-200 rounded-lg font-medium px-3 py-1.5 flex space-x-1 items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}
