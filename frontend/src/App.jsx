import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">SimplyShop Header</div>
      </header>

      <main className="container mx-auto py-3 min-h-screen">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-10">
        <p>SimplyShop &copy; {new Date().getFullYear()}</p>
      </footer>

      <ToastContainer />
    </>
  );
};

export default App;