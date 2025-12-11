import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/users', config);
        setUsers(data);
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userInfo, refresh]);

  const deleteHandler = async (id) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/users/${id}`, config);
        toast.success('User berhasil dihapus');
        setRefresh(prev => !prev);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  if (loading) return <h2 className="text-center mt-10">Memuat Pengguna...</h2>;

  return (
    <div className="container mx-auto mt-10 px-4 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Daftar Pengguna</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                NAMA
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                EMAIL
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ADMIN
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 font-mono">{user._id.substring(0, 10)}...</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 font-bold">{user.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-center">
                  {user.isAdmin ? (
                    <FaCheck className="text-green-500 mx-auto" />
                  ) : (
                    <FaTimes className="text-red-500 mx-auto" />
                  )}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-center">
                  <button
                    onClick={() => deleteHandler(user._id)}
                    className="text-red-600 hover:text-red-900 inline-block p-2"
                    title="Hapus User"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListScreen;