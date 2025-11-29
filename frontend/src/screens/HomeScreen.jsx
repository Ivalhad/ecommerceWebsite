import { useEffect, useState } from 'react';
import axios from 'axios';
import Product from '../components/Product';

const HomeScreen = () => {
  // state for save product
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      
      setProducts(data.products); 
    };

    fetchProducts();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Produk Terbaru</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </>
  );
};

export default HomeScreen;