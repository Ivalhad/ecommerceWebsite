import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get data cart
  const { cartItems, loading } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
        navigate('/login');
    } else {
        dispatch(fetchCart());
    }
  }, [dispatch, userInfo, navigate]);

  // delete item
  const removeFromCartHandler = async (productId) => {
    try {
    
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success('Produk dihapus dari keranjang');
    } catch (err) {
      toast.error(err || 'Gagal menghapus produk');
    }
  };

  // cekout
  const checkoutHandler = () => {
    navigate('/shipping');
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
             <p className="text-xl text-gray-500 animate-pulse">Memuat Keranjang...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-6">
      <Link className='btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mb-6 transition-colors' to='/'>
        <FaArrowLeft className="mr-2"/> Lanjut Belanja
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">Keranjang Belanja</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Keranjang kamu kosong</h2>
          <p className="text-gray-500 mb-6">Sepertinya kamu belum menambahkan barang apapun.</p>
          <Link to="/" className="bg-slate-800 text-white py-3 px-8 rounded-lg hover:bg-slate-700 transition font-medium">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition hover:shadow-md">

                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <Link to={`/product/${item.product}`} className="text-lg font-bold text-gray-800 hover:text-orange-500 line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">Harga Satuan: Rp {item.price.toLocaleString('id-ID')}</p>
                  <p className="text-gray-700 font-medium mt-2">Qty: {item.qty}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <span className="text-lg font-bold text-orange-600">
                        Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </span>
                    <button 
                        onClick={() => removeFromCartHandler(item.product)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                        title="Hapus Barang"
                    >
                        <FaTrash size={18} />
                    </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Ringkasan Pesanan</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Total Barang</span>
                  <span className="font-medium">{totalItems} items</span>
                </div>
                <div className="flex justify-between text-gray-800 text-lg font-bold pt-4 border-t border-gray-100">
                  <span>Total Harga</span>
                  <span className="text-orange-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition font-bold text-lg shadow-lg transform hover:-translate-y-0.5"
              >
                Checkout Sekarang
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartScreen;