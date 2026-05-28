import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import recipesReducer from './recipesSlice';
import favoritesReducer from './favoritesSlice';

const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    recipes: recipesReducer,
    favorites: favoritesReducer,
  },
});

export default store;