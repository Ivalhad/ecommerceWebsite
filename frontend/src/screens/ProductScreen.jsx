import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaArrowLeft } from 'react-icons/fa';

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const { id: productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <>
      <Link className='btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mb-4' to='/'>
        <FaArrowLeft className="mr-2"/> Kembali
      </Link>

      {product.name ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-lg object-cover"
            />
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold mb-2 text-gray-800">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center mb-4 text-yellow-500 text-lg">
                <FaStar className="mr-1" />
                <span className="text-gray-600 font-medium text-sm">
                  {product.rating} dari {product.numReviews} ulasan
                </span>
              </div>

              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  Rp {product.price?.toLocaleString('id-ID')}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-gray-700">Status:</span>
                <span className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.countInStock > 0 ? 'Tersedia' : 'Habis'}
                </span>
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg text-white font-bold tracking-wide transition duration-200 
                  ${product.countInStock > 0 
                    ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={product.countInStock === 0}
                onClick={() => alert("Fitur Keranjang segera hadir!")} // Nanti kita ganti ini
              >
                {product.countInStock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-xl mt-10">Memuat Produk...</p>
      )}
    </>
  );
};

export default ProductScreen;