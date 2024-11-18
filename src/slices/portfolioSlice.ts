import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  amount: number;
  changePercent24Hr?: number;
}

interface PortfolioState {
  items: PortfolioItem[];
}

const initialState: PortfolioState = {
  items: [], // Начальное состояние портфеля
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addOrUpdateItem: (state, action: PayloadAction<PortfolioItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        existingItem.amount += action.payload.amount;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateItemAmount: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.amount = action.payload.amount;
      }
    },
    // Новый экшен для установки состояния портфеля
    setPortfolio: (state, action: PayloadAction<PortfolioItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addOrUpdateItem, removeItem, updateItemAmount, setPortfolio } = portfolioSlice.actions;

export default portfolioSlice.reducer;
