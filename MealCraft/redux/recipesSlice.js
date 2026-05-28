import { createSlice } from '@reduxjs/toolkit';

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipeList: [],
    loadingRecipes: false,
    loadingTip: false,
    error: '',
    cookingTip: 'Use fresh ingredients for better taste.',
    selectedRecipe: null,
    searchText: '',
  },
  reducers: {
    fetchRecipesStart: (state) => {
      state.loadingRecipes = true;
      state.error = '';
    },
    fetchRecipesSuccess: (state, action) => {
      state.loadingRecipes = false;
      state.recipeList = action.payload;
    },
    fetchRecipesFailure: (state, action) => {
      state.loadingRecipes = false;
      state.error = action.payload;
    },
    fetchTipStart: (state) => {
      state.loadingTip = true;
    },
    fetchTipSuccess: (state, action) => {
      state.loadingTip = false;
      state.cookingTip = action.payload;
    },
    fetchTipFailure: (state) => {
      state.loadingTip = false;
      state.cookingTip = 'Cook with confidence and enjoy the process.';
    },
    setSelectedRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
    },
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
    },
    clearRecipes: (state) => {
      state.recipeList = [];
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
  },
});

export const {
  fetchRecipesStart,
  fetchRecipesSuccess,
  fetchRecipesFailure,
  fetchTipStart,
  fetchTipSuccess,
  fetchTipFailure,
  setSelectedRecipe,
  clearSelectedRecipe,
  clearRecipes,
  setSearchText,
} = recipesSlice.actions;

export default recipesSlice.reducer;