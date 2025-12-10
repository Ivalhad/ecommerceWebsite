import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaUser, FaShoppingBag, FaMoneyBillWave, FaBoxOpen } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'react-toastify';

const DashboardScreen = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/orders/summary', config);
        setSummary(data);
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchSummary();
  }, [userInfo]);

  if (loading) return <h2 className="text-center mt-10">Memuat Statistik...</h2>;
  if (!summary) return <h2 className="text-center mt-10 text-red-500">Gagal memuat data.</h2>;

  return (
    <div className="container mx-auto mt-10 px-4 mb-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Admin</h1>

      {/* --- card static --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* total sell */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 flex items-center">
          <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600">
            <FaMoneyBillWave size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Pendapatan</p>
            <h3 className="text-2xl font-bold text-gray-800">
              Rp {summary.totalSales.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>

        {/* total order */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4 text-blue-600">
            <FaShoppingBag size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Pesanan</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary.ordersCount}</h3>
          </div>
        </div>

        {/* total product */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 flex items-center">
          <div className="p-3 bg-orange-100 rounded-full mr-4 text-orange-600">
            <FaBoxOpen size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Produk Aktif</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary.productsCount}</h3>
          </div>
        </div>

        {/* total user */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 flex items-center">
          <div className="p-3 bg-purple-100 rounded-full mr-4 text-purple-600">
            <FaUser size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pelanggan</p>
            <h3 className="text-2xl font-bold text-gray-800">{summary.usersCount}</h3>
          </div>
        </div>
      </div>

      {/* --- grafik selling --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-700">Grafik Penjualan Harian</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={summary.dailyOrders}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
              <Legend />
              <Bar dataKey="sales" name="Penjualan (Rp)" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;