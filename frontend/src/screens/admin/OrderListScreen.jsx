import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaCheck, FaTimes, FaTruck, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  // fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/orders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, refresh]);

  // handlers for updating
  const markAsPaidHandler = async (id) => {
    if (window.confirm('Apakah pembayaran sudah diterima?')) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.put(`/api/orders/${id}/pay`, {}, config);
            toast.success('Status pembayaran diperbarui!');
            setRefresh(prev => !prev); 
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    }
  };

  // handler deliverd
  const markAsDeliveredHandler = async (id) => {
    if (window.confirm('Apakah barang sudah dikirim?')) {
        try {
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            await axios.put(`/api/orders/${id}/deliver`, {}, config);
            toast.success('Status pengiriman diperbarui!');
            setRefresh(prev => !prev);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    }
  };

  if (loading) return <h2 className="text-center mt-10">Memuat Pesanan...</h2>;

  return (
    <div className="container mx-auto mt-10 px-4 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Pesanan</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID / USER
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                TANGGAL
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                TOTAL
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                STATUS BAYAR
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                STATUS KIRIM
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                {/*  id  */}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{order.user?.name || 'User Dihapus'}</span>
                    <span className="text-xs text-gray-500 font-mono">#{order._id.substring(0, 10)}...</span>
                  </div>
                </td>

                {/* date */}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900">{order.createdAt.substring(0, 10)}</p>
                </td>

                {/* price */}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 font-bold">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                  <span className="text-xs text-gray-500">{order.paymentMethod}</span>
                </td>

                {/* status payment*/}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-center">
                   {order.isPaid ? (
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        <FaCheck className="mr-1"/> Lunas
                        <span className="ml-1 text-[10px] hidden lg:inline">({order.paidAt?.substring(0,10)})</span>
                     </span>
                   ) : (
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        <FaTimes className="mr-1"/> Belum
                     </span>
                   )}
                </td>

                {/* Status shipping */}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-center">
                   {order.isDelivered ? (
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        <FaCheck className="mr-1"/> Terkirim
                     </span>
                   ) : (
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                        Proses
                     </span>
                   )}
                </td>

                <td className="px-5 py-5 border-b border-gray-200 bg-white text-center">
                  <div className="flex flex-col space-y-2 items-center">
                    
                    {!order.isPaid && (
                        <button 
                            onClick={() => markAsPaidHandler(order._id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded flex items-center shadow transition"
                            title="Tandai sudah bayar"
                        >
                            <FaMoneyBillWave className="mr-1" /> Acc Bayar
                        </button>
                    )}

                    {order.isPaid && !order.isDelivered && (
                        <button 
                            onClick={() => markAsDeliveredHandler(order._id)}
                            className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-3 py-1 rounded flex items-center shadow transition"
                            title="Tandai sudah dikirim"
                        >
                            <FaTruck className="mr-1" /> Kirim Barang
                        </button>
                    )}

                    {order.isPaid && order.isDelivered && (
                        <span className="text-gray-400 text-xs italic">Selesai</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
            <div className="p-10 text-center text-gray-500">Belum ada pesanan masuk.</div>
        )}
      </div>
    </div>
  );
};

export default OrderListScreen;