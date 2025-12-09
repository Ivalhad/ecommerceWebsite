import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import Paginate from '../components/Paginate'; 

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // get keyword and page number
  const { keyword, pageNumber } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products', {
        params: { 
          keyword: keyword, 
          pageNumber: pageNumber 
        }
      });
      
      setProducts(data.products);
      setPage(data.page);
      setPages(data.pages);
    };

    fetchProducts();
  }, [keyword, pageNumber]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-700">
        {keyword ? `Hasil Pencarian: "${keyword}"` : 'Produk Terbaru'}
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
    </>
  );
};

export default HomeScreen;