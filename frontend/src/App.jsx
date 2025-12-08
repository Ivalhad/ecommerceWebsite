import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer'; 

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container mx-auto py-6 px-4 grow">
        <Outlet />
      </main>

      <Footer />

      <ToastContainer />
    </div>
  );
};

export default App;