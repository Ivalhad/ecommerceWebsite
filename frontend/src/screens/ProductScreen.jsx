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
      <Link className='btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mb-6 transition-colors' to='/'>
        <FaArrowLeft className="mr-2"/> Kembali
      </Link>

      {product.name ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          <div className="md:col-span-1">
            <div className="h-[500px] w-full bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-200 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col justify-start">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
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
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 cursor-pointer' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={product.countInStock === 0}
                onClick={() => alert("Fitur Keranjang segera hadir!")} 
              >
                {product.countInStock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
              </button>
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