import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser, getMe } from '../../services/api';
import { AuthState, User } from '../../types';

const initialState: AuthState = {
  user:      JSON.parse(localStorage.getItem('user') || 'null'),
  token:     localStorage.getItem('token'),
  isLoading: false,
  error:     null,
};

export const login = createAsyncThunk('auth/login', async (data: object, { rejectWithValue }) => {
  try { return (await loginUser(data)).data; }
  catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(e.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data: object, { rejectWithValue }) => {
  try { return (await registerUser(data)).data; }
  catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(e.response?.data?.message || 'Register failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try { return (await getMe()).data; }
  catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(e.response?.data?.message || 'Failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null; state.token = null;
      localStorage.removeItem('token'); localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => { state.isLoading = true; state.error = null; };
    const handleFulfilled = (state: AuthState, action: PayloadAction<{ token: string; user: User }>) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user  = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    };
    const handleRejected = (state: AuthState, action: PayloadAction<unknown>) => {
      state.isLoading = false; state.error = action.payload as string;
    };
    builder.addCase(login.pending, handlePending);
    builder.addCase(login.fulfilled, handleFulfilled);
    builder.addCase(login.rejected, handleRejected);
    builder.addCase(register.pending, handlePending);
    builder.addCase(register.fulfilled, handleFulfilled);
    builder.addCase(register.rejected, handleRejected);
    builder.addCase(fetchMe.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMe.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    });
    builder.addCase(fetchMe.rejected, (state, action: PayloadAction<unknown>) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.error = action.payload as string;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
