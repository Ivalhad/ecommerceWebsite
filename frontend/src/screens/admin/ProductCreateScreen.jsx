import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';

const ProductCreateScreen = () => {
  const navigate = useNavigate();

  // state form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [file, setFile] = useState(null); 
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const [uploading, setUploading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  // handler upload file
  const uploadFileHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setImage(URL.createObjectURL(selectedFile));
    }
  };

  // handler submit
  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!file) {
        toast.error("Harap upload gambar produk!");
        return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('brand', brand);
      formData.append('category', category);
      formData.append('countInStock', countInStock);
      formData.append('description', description);
      formData.append('image', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post('/api/products', formData, config);

      toast.success('Produk berhasil dibuat!');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4 mb-20 max-w-2xl">
      <Link to="/admin/productlist" className="btn text-gray-600 hover:text-gray-900 flex items-center mb-6">
        <FaArrowLeft className="mr-2" /> Kembali
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Produk Baru</h1>

        <form onSubmit={submitHandler} className="space-y-5">
          
          {/* name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nama Produk</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sepatu Nike Air"
            />
          </div>

          {/* harga */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Harga (Rp)</label>
            <input
              type="number"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* upload image */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gambar Produk</label>
            <div className="flex items-center space-x-4 mb-3">

                <div className="w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden">
                    {image ? (
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                    )}
                </div>
                
                <label className="cursor-pointer bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition flex items-center shadow-md">
                    <FaUpload className="mr-2" />
                    <span className="text-sm font-medium">Pilih Gambar</span>
                    <input type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" />
                </label>
            </div>
            {file && <p className="text-xs text-green-600 font-medium">File: {file.name}</p>}
          </div>

          {/* brand & category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2">Brand</label>
                <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Nike"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">Kategori</label>
                <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Sepatu"
                />
            </div>
          </div>

          {/* stock */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Stok (Qty)</label>
            <input
              type="number"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </div>

          {/* desc */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Deskripsi</label>
            <textarea
              rows="4"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail produk..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-bold shadow-lg"
          >
            {uploading ? 'Sedang Mengupload...' : 'Simpan Produk'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProductCreateScreen;