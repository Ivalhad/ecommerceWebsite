import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  // state form
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(''); 
  const [file, setFile] = useState(null);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  // fetch data 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // handler upload file
  const uploadFileHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setImage(URL.createObjectURL(selectedFile));
    }
  };

  // handler update product
  const submitHandler = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('countInStock', countInStock);
      formData.append('description', description);
      
      if (file) {
        formData.append('image', file);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/products/${productId}`, formData, config);

      toast.success('Produk berhasil diupdate!');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <h2 className="text-center mt-10">Memuat Data...</h2>;

  return (
    <div className="container mx-auto mt-10 px-4 mb-20 max-w-2xl">
      <Link to="/admin/productlist" className="btn text-gray-600 hover:text-gray-900 flex items-center mb-6">
        <FaArrowLeft className="mr-2" /> Kembali ke Daftar Produk
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Produk</h1>

        <form onSubmit={submitHandler} className="space-y-5">
          
          {/* name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nama Produk</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* price */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Harga (Rp)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* image preview */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gambar</label>
            <div className="flex items-center space-x-4 mb-3">
                {image && (
                    <img src={image} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                )}
                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center">
                    <FaUpload className="mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Ganti Gambar</span>
                    <input type="file" className="hidden" onChange={uploadFileHandler} />
                </label>
            </div>

            {file && <p className="text-xs text-green-600">File terpilih: {file.name}</p>}
          </div>

          {/* brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2">Brand</label>
                <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">Kategori</label>
                <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                />
            </div>
          </div>

          {/* stock */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Stok (Qty)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </div>

          {/* description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Deskripsi</label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-700 transition font-bold"
          >
            {uploading ? 'Menyimpan...' : 'Update Produk'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProductEditScreen;