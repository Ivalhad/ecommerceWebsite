import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const Product = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      
      <div className="relative w-full h-72 overflow-hidden bg-gray-200">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
          />
        </Link>
      </div>

      <div className="p-4 flex flex-col grow justify-between">
        <div>
          {/* Product Name */}
          <Link to={`/product/${product._id}`}>
            <h3 className="text-lg font-bold text-gray-800 hover:text-orange-500 line-clamp-2 leading-tight mb-2" title={product.name}>
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600 font-medium">
              {product.rating} <span className="text-gray-400 mx-1">|</span> {product.numReviews} ulasan
            </span>
          </div>
        </div>

        {/* Price */}
        <h3 className="text-xl font-extrabold text-gray-900">
          Rp {product.price.toLocaleString('id-ID')}
        </h3>
      </div>
    </div>
  );
};

export default Product;