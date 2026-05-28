import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favoriteRecipes: [],
    cookedMeals: 0,
    currentStep: 1,
    totalSteps: 5,
    weeklyGoal: 4,

  
    activeRecipeName: '',
    activeRecipeSteps: [],
  },

  reducers: {
    addFavorite: (state, action) => {
      const exists = state.favoriteRecipes.find(
        (item) => item.idMeal === action.payload.idMeal
      );
      if (!exists) {
        state.favoriteRecipes.push(action.payload);
      }
    },

    removeFavorite: (state, action) => {
      state.favoriteRecipes = state.favoriteRecipes.filter(
        (item) => item.idMeal !== action.payload
      );
    },

    clearFavorites: (state) => {
      state.favoriteRecipes = [];
    },

    nextCookingStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },

    previousCookingStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },

    resetCookingSteps: (state) => {
      state.currentStep = 1;
    },

    markMealCooked: (state) => {
      state.cookedMeals += 1;

    
      state.activeRecipeName = '';
      state.activeRecipeSteps = [];
      state.currentStep = 1;
      state.totalSteps = 5;
    },

    resetCookedMeals: (state) => {
      state.cookedMeals = 0;
    },

    setWeeklyGoal: (state, action) => {
      state.weeklyGoal = action.payload;
    },

    setTotalSteps: (state, action) => {
      state.totalSteps = action.payload;
    },


    setActiveRecipe: (state, action) => {
      state.activeRecipeName = action.payload.recipeName;
      state.activeRecipeSteps = action.payload.steps;
      state.currentStep = 1;
      state.totalSteps = action.payload.steps.length || 1;
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  clearFavorites,
  nextCookingStep,
  previousCookingStep,
  resetCookingSteps,
  markMealCooked,
  resetCookedMeals,
  setWeeklyGoal,
  setTotalSteps,


  setActiveRecipe,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;