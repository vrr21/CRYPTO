import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '../slices/cryptoSlice';
import portfolioReducer from '../slices/portfolioSlice';

const store = configureStore({
  reducer: {
    cryptos: cryptoReducer,
    portfolio: portfolioReducer,
  },
});

export default store;