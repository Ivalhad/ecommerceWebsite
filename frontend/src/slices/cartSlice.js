import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/cart');
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, qty }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/cart', { productId, qty });
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/api/cart/${productId}`);
    return data; 
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

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

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;