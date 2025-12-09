import { useState, useEffect, useCallback } from 'react'; // <--- Tambah useCallback
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaStar, FaArrowLeft, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);

  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Gagal memuat produk");
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // add to cart
  const addToCartHandler = async () => {
    if (!userInfo) {
      toast.warn('Silakan login terlebih dahulu untuk belanja!');
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToCart({ productId, qty: 1 })).unwrap();
      toast.success('Produk berhasil masuk keranjang!');
      navigate('/cart');
    } catch (err) {
      toast.error(err?.message || 'Gagal menambahkan ke keranjang');
    }
  };

  // review
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error('Harap beri penilaian dan komentar');
      return;
    }

    setLoadingReview(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        `/api/products/${productId}/reviews`,
        { rating, comment },
        config
      );

      toast.success('Review berhasil dikirim!');
      setRating(0);
      setComment('');
      fetchProduct(); 
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoadingReview(false);
    }
  };

  return (
    <>
      <Link className='btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mb-6 transition-colors' to='/'>
        <FaArrowLeft className="mr-2"/> Kembali
      </Link>

      {product.name ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* image */}
          <div className="md:col-span-1">
            <div className="h-[500px] w-full bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* --- review --- */}
          <div className="md:col-span-1 flex flex-col justify-start">
            
            {/* detail product*/}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
              <h3 className="text-3xl font-extrabold mb-2 text-gray-800">{product.name}</h3>
              
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 text-lg">
                  <FaStar />
                </div>
                <span className="ml-2 text-gray-600 font-medium">
                  {product.rating} <span className="mx-1">|</span> {product.numReviews} ulasan
                </span>
              </div>

              <div className="border-t border-b border-gray-100 py-6 mb-6">
                <p className="text-4xl font-bold text-orange-600 mb-4">
                  Rp {product.price?.toLocaleString('id-ID')}
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-semibold text-gray-700 text-lg">Status:</span>
                <span className={`font-bold px-3 py-1 rounded-full text-sm ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.countInStock > 0 ? 'Tersedia' : 'Habis'}
                </span>
              </div>

              <button
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg tracking-wide shadow-md transition transform hover:-translate-y-1 
                  ${product.countInStock > 0 
                    ? 'bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 cursor-pointer' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={product.countInStock === 0}
                onClick={addToCartHandler} 
              >
                {product.countInStock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ulasan Pelanggan</h2>
              
              {product.reviews.length === 0 && (
                <div className="p-4 bg-blue-50 text-blue-700 rounded-lg mb-4">
                  Belum ada ulasan. Jadilah yang pertama mereview produk ini!
                </div>
              )}

              <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center mb-2">
                      <FaUserCircle className="text-gray-400 text-3xl mr-3" />
                      <div>
                        <strong className="text-gray-800 block">{review.name}</strong>

                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-gray-500">
                        {review.createdAt.substring(0, 10)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* form review */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tulis Ulasan Anda</h3>
                
                {userInfo ? (
                  <form onSubmit={submitHandler}>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                      >
                        <option value="">Pilih...</option>
                        <option value="1">1 - Sangat Buruk</option>
                        <option value="2">2 - Buruk</option>
                        <option value="3">3 - Biasa Saja</option>
                        <option value="4">4 - Bagus</option>
                        <option value="5">5 - Sangat Bagus</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Komentar</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Bagaimana kualitas produk ini?"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loadingReview}
                      className="w-full bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition font-semibold"
                    >
                      {loadingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-orange-50 text-orange-800 rounded-lg border border-orange-200">
                    Silakan <Link to="/login" className="font-bold underline">Login</Link> untuk menulis ulasan.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
           <p className="text-xl text-gray-500 animate-pulse">Memuat Produk...</p>
        </div>
      )}
    </>
  );
};

export default ProductScreen;