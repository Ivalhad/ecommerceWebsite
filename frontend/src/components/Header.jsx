import { useEffect } from 'react';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; 
import { logout } from '../slices/authSlice';
import { fetchCart, clearCartLocal } from '../slices/cartSlice';
import axios from 'axios';

const Header = () => {
  //get data user
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
    }
  }, [dispatch, userInfo]);

  const logoutHandler = async () => {
    try {
      await axios.post('/api/users/logout');
      dispatch(logout());
      dispatch(clearCartLocal());
      navigate('/login');
    } catch (err) {
      console.error(err);
      dispatch(logout());
      dispatch(clearCartLocal());
      navigate('/login');
    }
  };

  // count total items
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold tracking-wider text-orange-500 hover:text-orange-400 transition">
          SimplyShop
        </Link>

        
        <div className="flex space-x-6 items-center">
          
          <Link to="/cart" className="flex items-center space-x-1 hover:text-gray-300 transition relative">
            <FaShoppingCart className="text-xl" />
            <span className="hidden md:inline">Cart</span>
            
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="flex items-center space-x-4">
              <span className="text-orange-400 font-semibold hidden md:inline">
                Halo, {userInfo.name}
              </span>
              <button 
                onClick={logoutHandler}
                className="flex items-center space-x-1 hover:text-red-400 transition cursor-pointer"
                title="Logout"
              >
                <FaSignOutAlt />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 hover:text-gray-300 transition">
              <FaUser />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;