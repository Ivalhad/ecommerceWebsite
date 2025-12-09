import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <div className="flex justify-center mt-10 pb-10">
        <nav className="flex bg-white rounded-lg shadow-sm p-2 space-x-2">
          {[...Array(pages).keys()].map((x) => (
            <Link
              key={x + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/admin/productlist/${x + 1}`
              }
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 border ${
                x + 1 === page
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105' // Gaya Halaman Aktif
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200' // Gaya Halaman Tidak Aktif
              }`}
            >
              {x + 1}
            </Link>
          ))}
        </nav>
      </div>
    )
  );
};

export default Paginate;