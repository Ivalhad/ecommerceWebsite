import { useEffect, useState } from 'react';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { fetchCart, clearCartLocal } from '../slices/cartSlice';
import axios from 'axios';
import SearchBox from './SearchBox';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State untuk dropdown admin

  const hideMenuRoutes = ['/login', '/register'];
  const showMenus = !hideMenuRoutes.includes(location.pathname);

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

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider text-orange-500 hover:text-orange-400 transition">
          SimplyShop
        </Link>

        {showMenus && (
          <>
            <div className="hidden md:block flex-1 max-w-md mx-auto">
               <SearchBox />
            </div>

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
                <div className="flex items-center space-x-4 relative">
                  
                  {/* admin menu*/}
                  {userInfo.role === 'admin' && (
                    <div className="relative">
                      <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-1 hover:text-orange-400 focus:outline-none"
                      >
                        <span>Admin</span>
                        <FaCaretDown />
                      </button>
                      
                      {/* dropdown */}
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 text-gray-800 border border-gray-200">
                          <Link 
                            to="/admin/productlist" 
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Produk
                          </Link>
                          <Link 
                            to="/admin/orderlist" 
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Pesanan
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-orange-400 font-semibold hidden md:inline border-l border-gray-600 pl-4">
                    {userInfo.name}
                  </span>
                  
                  <button 
                    onClick={logoutHandler}
                    className="flex items-center space-x-1 hover:text-red-400 transition cursor-pointer"
                    title="Logout"
                  >
                    <FaSignOutAlt />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center space-x-1 hover:text-gray-300 transition">
                  <FaUser />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;