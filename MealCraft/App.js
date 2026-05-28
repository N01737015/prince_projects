import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './redux/store';

import HomeScreen from './screens/HomeScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import RecipeResultsScreen from './screens/RecipeResultsScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import CookingProgressScreen from './screens/CookingProgressScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#4e342e' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'MealCraft',
              headerBackVisible: false,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen name="Ingredients" component={IngredientsScreen} />
          <Stack.Screen
            name="RecipeResults"
            component={RecipeResultsScreen}
            options={{ title: 'Recipes' }}
          />
          <Stack.Screen
            name="RecipeDetail"
            component={RecipeDetailScreen}
            options={{ title: 'Recipe Detail' }}
          />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen
            name="CookingProgress"
            component={CookingProgressScreen}
            options={{ title: 'Cooking Progress' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}