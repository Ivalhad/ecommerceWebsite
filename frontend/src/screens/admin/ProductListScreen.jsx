import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Paginate from '../../components/Paginate';

const ProductListScreen = () => {
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [refresh, setRefresh] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`/api/products?pageNumber=${pageNumber || 1}`);
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        toast.error(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber, refresh]);

  const deleteHandler = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/products/${id}`, config);
        toast.success('Produk dihapus');
        
        setRefresh(prev => !prev); 
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  // create product handler
  const createProductHandler = () => {
    navigate('/admin/product/create');
  };

  if (loading) return <h2 className="text-center mt-10">Memuat Data...</h2>;

  return (
    <div className="container mx-auto mt-10 px-4 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Produk</h1>
        <button 
            onClick={createProductHandler}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 transition"
        >
          <FaPlus className="mr-2" /> Tambah Produk
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                HARGA
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                KATEGORI
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                BRAND
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{product._id}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <Link to={`/product/${product._id}`} className="text-gray-900 font-bold hover:text-orange-500">
                    {product.name}
                  </Link>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Rp {product.price.toLocaleString('id-ID')}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{product.category}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{product.brand}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                  <Link
                    to={`/admin/product/${product._id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-4 inline-block"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => deleteHandler(product._id)}
                    className="text-red-600 hover:text-red-900 inline-block"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Paginate pages={pages} page={page} isAdmin={true} />
    </div>
  );
};

export default ProductListScreen;