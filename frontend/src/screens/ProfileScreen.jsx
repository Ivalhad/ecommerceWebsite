import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes, FaCheck } from 'react-icons/fa'; 
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  // state profile
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // state order
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // login
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  // history order
  useEffect(() => {
    const fetchMyOrders = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            
            const { data } = await axios.get('/api/orders/myorders', config);
            setOrders(data);
            setLoadingOrders(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message);
            setLoadingOrders(false);
        }
    };

    if (userInfo) {
        fetchMyOrders();
    }
  }, [userInfo]);

  // update profile
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

        dispatch(setCredentials({ ...res.data }));
        toast.success('Profil berhasil diperbarui!');
        setPassword('');
        setConfirmPassword('');
        
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto mt-10 mb-20 px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* edit profile */}
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800">User Profile</h2>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Nama</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Password Baru</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Opsional"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Konfirmasi Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Konfirmasi password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition font-semibold"
                    >
                        Update Profil
                    </button>
                </form>
            </div>
        </div>

        {/* order table */}
        <div className="md:col-span-3">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Riwayat Pesanan Saya</h2>
            
            {loadingOrders ? (
                <p>Memuat pesanan...</p>
            ) : orders.length === 0 ? (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
                    Kamu belum pernah berbelanja. <Link to="/" className="underline font-bold">Mulai Belanja</Link>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    TANGGAL
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    TOTAL
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    BAYAR
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    KIRIM
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 font-mono">{order._id.substring(0, 10)}...</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900">{order.createdAt.substring(0, 10)}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 font-bold">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-center">
                                        {order.isPaid ? (
                                            <span className="text-green-600 flex items-center justify-center text-xs font-bold">
                                                <FaCheck className="mr-1"/> {order.paidAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span className="text-red-500 flex items-center justify-center text-xs font-bold">
                                                <FaTimes className="mr-1"/> Belum
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-center">
                                        {order.isDelivered ? (
                                            <span className="text-green-600 flex items-center justify-center text-xs font-bold">
                                                <FaCheck className="mr-1"/> {order.deliveredAt.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span className="text-red-500 flex items-center justify-center text-xs font-bold">
                                                <FaTimes className="mr-1"/> Proses
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default ProfileScreen;