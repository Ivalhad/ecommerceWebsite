import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex w-full max-w-md mx-auto">
      <div className="relative w-full">
        <input
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder="Cari produk apa..."
          className="w-full px-5 py-2.5 bg-white border-none rounded-l-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md"
        />
      </div>
      
      <button 
        type="submit" 
        className="px-6 bg-orange-500 text-white rounded-r-full hover:bg-orange-600 transition-colors duration-200 shadow-md flex items-center justify-center"
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBox;