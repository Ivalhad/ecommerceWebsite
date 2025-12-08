import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import axios from 'axios';

const Header = () => {

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {

      await axios.post('/api/users/logout', {}, {
         headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
      dispatch(logout()); 
      navigate('/login');
    }
  };

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

          {userInfo ? (
            <div className="flex items-center space-x-4">
              <span className="text-orange-400 font-semibold">
                Halo, {userInfo.name}
              </span>
              <button 
                onClick={logoutHandler}
                className="flex items-center space-x-1 hover:text-red-400 transition cursor-pointer"
              >
                <FaSignOutAlt />
                <span>Logout</span>
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