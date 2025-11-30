import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const Product = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* product image */}
      <Link to={`/product/${product._id}`} className="block relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* product name */}
          <Link to={`/product/${product._id}`}>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 truncate" title={product.name}>
              {product.name}
            </h3>
          </Link>

          {/* rating and review */}
          <div className="flex items-center mt-2 mb-2 text-yellow-500">
            <FaStar />
            <span className="ml-1 text-sm text-gray-600 font-medium">
              {product.rating} ({product.numReviews} ulasan)
            </span>
          </div>
        </div>

        {/* price */}
        <h3 className="text-xl font-bold text-gray-900 mt-2">
          Rp {product.price.toLocaleString('id-ID')}
        </h3>
      </div>
    </div>
  );
};

export default Product;