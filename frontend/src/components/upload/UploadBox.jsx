import { useState, useEffect } from 'react';
import { postApi } from '../../services/post.api';
import { userApi } from '../../services/user.api';
import { useRouter } from 'next/navigation';

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [board, setBoard] = useState('');
  const [boards, setBoards] = useState([]);
  const [preview, setPreview] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserBoards = async () => {
      try {
        const res = await userApi.getProfile();
        if (res.data.user && res.data.user.boards) {
          setBoards(res.data.user.boards);
          if (res.data.user.boards.length > 0) {
            setBoard(res.data.user.boards[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch boards', error);
      }
    };
    fetchUserBoards();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('postimage', file);
    formData.append('title', title);
    formData.append('description', description);
    if (board) {
      formData.append('board', board);
    }

    try {
      await postApi.createPost(formData);
      router.push('/profile');
    } catch (error) {
      console.error('Failed to create post', error);
      alert('Failed to upload. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
      <h2 className="text-2xl font-bold mb-4">Create New Pin</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Image</label>
        <input type="file" onChange={handleFileChange} accept="image/*" className="w-full border p-2 rounded" />
        {preview && <img src={preview} alt="Preview" className="mt-4 w-full h-auto rounded" />}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Add a title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Tell everyone what your Pin is about"
        ></textarea>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Board</label>
        <select
          value={board}
          onChange={(e) => setBoard(e.target.value)}
          className="w-full border p-2 rounded bg-white text-black"
        >
          {boards.length === 0 && <option value="">No boards available</option>}
          {boards.map(b => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition">
        Save
      </button>
    </form>
  );
}
