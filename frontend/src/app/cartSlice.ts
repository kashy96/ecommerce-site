import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { getUserIdFromState } from '@/lib/utils';
import { Cart } from '../../types';

// interface CartItem {
//   productId: string;
//   quantity: number;
//   price: number;
//   total: number;
//   name?: string;
//   image?: string;
// }

// interface Cart {
//   userId: string;
//   items: CartItem[];
//   subTotal: number;
// }

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { getState, rejectWithValue }) => {
      try {
        const state = getState() as RootState;
        const userId = getUserIdFromState(state);
        if (!userId) throw new Error('User not authenticated');
  
        const response = await fetch(`/api/cart/${userId}`);
        const data = await response.json();
  
        if (data.status_code !== 200) throw new Error(data.message);
        return data.data;
      } catch (err: any) {
        return rejectWithValue(err.message || 'Error fetching cart');
      }
    }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { getState }
  ) => {
    const state = getState() as RootState;
    const userId = getUserIdFromState(state);
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    
    const data = await response.json();
    if (data.status_code !== 200) throw new Error(data.message);
    return data.data;
  }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId: string, { getState, rejectWithValue }) => {
      try {
        const state = getState() as RootState;
        const userId = getUserIdFromState(state);
        if (!userId) throw new Error('User not authenticated');
  
        const response = await fetch(`/api/cart/${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        });
        const data = await response.json();
  
        if (data.status_code !== 200) throw new Error(data.message);
        return data.data;
      } catch (err: any) {
        return rejectWithValue(err.message || 'Failed to remove item');
      }
    }
);

export const emptyCart = createAsyncThunk(
    'cart/emptyCart',
    async (_, { getState, rejectWithValue }) => {
      try {
        console.log("inside emptied cart");
        
        const state = getState() as RootState;
        console.log("The state is", state.auth.user.id);
        
        const userId = getUserIdFromState(state);
        console.log('The user id is',userId);
        
        if (!userId) throw new Error('User not authenticated');
  
        console.log("into the empty cart method");
        
        const response = await fetch(`/api/cart/empty-cart/${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.message || 'Failed to empty cart');
        return data.message || 'Cart emptied successfully';
      } catch (err: any) {
        return rejectWithValue(err.message || 'Failed to remove item');
      }
    }
);
  

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const userId = getUserIdFromState(state);

      console.log(state.cart.cart);
      
      const currentItem = state.cart.cart?.items.find(item => item.productId === productId);
      const quantityDiff = quantity - (currentItem?.quantity || 0);

      if (quantityDiff === 0) return state.cart.cart;

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity: quantityDiff }),
      });
      const data = await response.json();

      if (data.status_code !== 200) throw new Error(data.message);
      return data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update quantity');
    }
  }
);
  

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload?.cart;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload?.updatedCart;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to cart';
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload?.updatedCart;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from cart';
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload?.updatedCart;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update quantity';
      })
      .addCase(emptyCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emptyCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = null;
      })
      .addCase(emptyCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to empty the cart';
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;