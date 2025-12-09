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
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex w-full max-w-sm ml-4">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Cari produk..."
        className="w-full px-4 py-2 border-none rounded-l-lg focus:ring-2 focus:ring-orange-500 text-gray-800"
      />
      <button type="submit" className="p-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition">
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBox;