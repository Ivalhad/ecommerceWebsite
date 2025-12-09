import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// fetch Cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
  try {

    const { auth } = getState();
    const token = auth.userInfo?.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get('/api/cart', config);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// add to Cart
export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, qty }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const token = auth.userInfo?.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post('/api/cart', { productId, qty }, config);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// remove from Cart 
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const token = auth.userInfo?.token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.delete(`/api/cart/${productId}`, config);
    return data; 
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

//clear Cart (Bersihkan Keranjang
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCartLocal: (state) => {
      state.cartItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        
        state.cartItems = action.payload.cartItems || []; 
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.fulfilled, (state, action) => {

        state.cartItems = action.payload.cartItems; 
      })

      // remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;