import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';

import App from './App.jsx';
import './index.css';

// Import Screens
import HomeScreen from './screens/HomeScreen.jsx';
import ProductScreen from './screens/ProductScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import CartScreen from './screens/CartScreen.jsx';
import ShippingScreen  from './screens/ShippingScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import AdminRoute from './components/AdminRoute'; 
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen.jsx';
import ProductCreateScreen from './screens/admin/ProductCreateScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/shipping' element={<ShippingScreen/>} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />

      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/productlist' element={<ProductListScreen />} />
        <Route path='/admin/productlist/:pageNumber' element={<ProductListScreen />} />
      </Route>

      <Route path='/admin/product/create' element={<ProductCreateScreen />} />
      <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);