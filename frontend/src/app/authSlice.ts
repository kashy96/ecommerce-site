import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

interface AuthState {
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
    token: string | null;
    role: string | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    id: null,
    name: null,
    email: null,
    token: null,
    role: null,
  },
  loading: false,
  error: null,
};

// Async thunk to fetch session and update auth state
export const syncAuthState = createAsyncThunk('auth/syncAuthState', async () => {
  const response = await fetch('/api/auth/session');
  const session = await response.json();
  if (session?.user) {
    return session.user;
  }
  return null;
});

// Async thunk to sign out
export const logout = createAsyncThunk('auth/logout', async () => {
  await signOut({ redirect: false });
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload || initialState.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncAuthState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncAuthState.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload || initialState.user;
      })
      .addCase(syncAuthState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sync auth state';
        state.user = initialState.user;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = initialState.user;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;