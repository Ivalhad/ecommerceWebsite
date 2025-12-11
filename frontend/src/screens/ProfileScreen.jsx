import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  // state intial
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Password dan Konfirmasi Password tidak sama');
      return;
    }

    try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const res = await axios.put(
            '/api/users/profile',
            { name, email, password },
            config
        );

        // update redux state
        dispatch(setCredentials({ ...res.data }));
        
        toast.success('Profil berhasil diperbarui!');
        
        // reset pasword fields
        setPassword('');
        setConfirmPassword('');
        
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 mb-20">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Profil</h1>

        <form onSubmit={submitHandler} className="space-y-4">
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nama Lengkap</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password Baru (Opsional)</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Isi jika ingin ganti password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Konfirmasi Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition duration-200 font-semibold mt-4 cursor-pointer"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileScreen;