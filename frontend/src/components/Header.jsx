import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold tracking-wider text-orange-500 hover:text-orange-400 transition">
          SimplyShop
        </Link>

        <div className="flex space-x-6 items-center">

          <Link to="/cart" className="flex items-center space-x-1 hover:text-gray-300 transition">
            <FaShoppingCart />
            <span>Cart</span>

            <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
              0
            </span>
          </Link>
          
          <Link to="/login" className="flex items-center space-x-1 hover:text-gray-300 transition">
            <FaUser />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;