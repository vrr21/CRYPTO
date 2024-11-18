import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../api/instance';

interface CryptoState {
  list: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null; // Исправляем тип
}

const initialState: CryptoState = {
  list: [],
  status: 'idle',
  error: null,
};

export const fetchCryptos = createAsyncThunk(
  'cryptos/fetchCryptos',
  async ({ page, limit }: { page: number; limit: number }) => {
    const offset = (page - 1) * limit;
    const response = await instance.get(`assets?offset=${offset}&limit=${limit}`);
    return response.data.data;
  }
);

const cryptoSlice = createSlice({
  name: 'cryptos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'An unexpected error occurred';
      });
  },
});

export default cryptoSlice.reducer;
