import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// get token from auth
const getAuthConfig = (getState) => {
  const { auth } = getState(); 
  const token = auth.userInfo?.token; 

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// fetch Cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
  try {
    
    const { data } = await axios.get('/api/cart', getAuthConfig(getState));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// add to Cart
export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, qty }, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.post(
      '/api/cart', 
      { productId, qty }, 
      getAuthConfig(getState) 
    );
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// remove from Cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.delete(
      `/api/cart/${productId}`, 
      getAuthConfig(getState) 
    );
    return data; 
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// clear Cart
export const clearCart = createAsyncThunk('cart/clearCart', async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.delete('/api/cart', getAuthConfig(getState));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
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

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems; 
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.cart.cartItems;
      })
      
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
      });
  },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;