
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../api/instance';
import { Crypto } from '../types/CryptoTypes';

interface CryptoState {
  list: Crypto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CryptoState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchCryptos = createAsyncThunk('cryptos/fetchCryptos', async () => {
  const response = await instance.get('assets');
  return response.data.data;
});

const cryptoSlice = createSlice({
  name: 'cryptos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export default cryptoSlice.reducer;