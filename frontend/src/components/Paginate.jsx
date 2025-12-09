import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <div className="flex justify-center mt-8 space-x-2">
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
            className={`px-4 py-2 rounded-lg border ${
              x + 1 === page
                ? 'bg-orange-500 text-white border-orange-500' // Aktif
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100' // Tidak aktif
            }`}
          >
            {x + 1}
          </Link>
        ))}
      </div>
    )
  );
};

export default Paginate;