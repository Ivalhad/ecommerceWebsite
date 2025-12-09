import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { clearCartLocal } from '../slices/cartSlice'; // Import aksi bersih keranjang

const ShippingScreen = () => {
  // address
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country] = useState('Indonesia');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil data keranjang & user
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Fungsi Submit Order
  const submitHandler = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
        toast.error("Keranjang kosong!");
        return;
    }

    try {
    // set order
      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'WhatsApp',
      };

    // confirm order
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // send order
      const { data } = await axios.post('/api/orders', orderData, config);

      toast.success('Pesanan Dibuat! Mengalihkan ke WhatsApp...');
      
      dispatch(clearCartLocal());
      
      if (data.whatsAppUrl) {
        window.location.href = data.whatsAppUrl;
      } else {
        navigate('/');
      }

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Pengiriman 🚚</h1>

        <form onSubmit={submitHandler} className="space-y-4">
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Alamat Lengkap</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
              placeholder="Jl. Mawar No. 123"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Kota</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
              placeholder="Jakarta Selatan"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Kode Pos</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
              placeholder="12345"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Negara</label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-3 border rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
              value={country}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition duration-200 font-bold text-lg shadow-md mt-6"
          >
            Lanjut ke WhatsApp 📲
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;