import { createSlice } from '@reduxjs/toolkit';

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    items: ['egg', 'tomato', 'cheese'],
    inputValue: '',
    selectedCategory: 'All',
    lastUpdated: '',
  },
  reducers: {
    addIngredient: (state, action) => {
      const value = action.payload.trim();
      if (value.length > 0) {
        state.items.push(value);
        state.lastUpdated = new Date().toLocaleString();
      }
    },
    removeIngredient: (state, action) => {
      state.items = state.items.filter((item, index) => index !== action.payload);
      state.lastUpdated = new Date().toLocaleString();
    },
    updateIngredient: (state, action) => {
      const { index, value } = action.payload;
      if (value.trim().length > 0) {
        state.items[index] = value.trim();
        state.lastUpdated = new Date().toLocaleString();
      }
    },
    clearIngredients: (state) => {
      state.items = [];
      state.lastUpdated = new Date().toLocaleString();
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    clearInputValue: (state) => {
      state.inputValue = '';
    },
    loadSampleIngredients: (state) => {
      state.items = ['potato', 'onion', 'milk', 'garlic'];
      state.lastUpdated = new Date().toLocaleString();
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const {
  addIngredient,
  removeIngredient,
  updateIngredient,
  clearIngredients,
  setInputValue,
  clearInputValue,
  loadSampleIngredients,
  setSelectedCategory,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;