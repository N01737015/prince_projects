import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addFavorite, setActiveRecipe } from '../redux/favoritesSlice';
import CustomButton from '../components/CustomButton';

export default function RecipeDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const recipeId = route.params?.recipeId;
  const recipeName = route.params?.recipeName;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!recipeId) {
      setLoading(false);
      setRecipe(null);
      return;
    }

    const fetchRecipeDetail = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
        );
        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
        } else {
          setRecipe(null);
        }
      } catch (error) {
        setRecipe(null);
        Alert.alert('Error', 'Failed to load recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [recipeId]);

  const getIngredients = () => {
    if (!recipe) return [];

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(`${measure ? measure : ''} ${ingredient}`.trim());
      }
    }

    return ingredients;
  };

  const getInstructionSteps = () => {
    if (!recipe?.strInstructions) return [];

    return recipe.strInstructions
      .split(/\r\n|\n|\./)
      .map((step) => step.trim())
      .filter((step) => step.length > 0)
      .map((step) =>
        step
          .replace(/^\d+[\)\.\-:]?\s*/i, '')
          .replace(/^step\s*\d+/i, '')
          .trim()
      )
      .filter(
        (step) =>
          step.length > 0 &&
          !/^\d+$/.test(step) &&
          !/^step$/i.test(step)
      );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6d4c41" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No recipe details found.</Text>
      </View>
    );
  }

  const ingredientList = getIngredients();
  const instructionSteps = getInstructionSteps();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

      <Text style={styles.title}>{recipe.strMeal || recipeName}</Text>
      <Text style={styles.meta}>Category: {recipe.strCategory}</Text>
      <Text style={styles.meta}>Area: {recipe.strArea}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {ingredientList.map((item, index) => (
        <Text key={index} style={styles.listItem}>
          • {item}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Instructions / Steps</Text>
      {instructionSteps.map((step, index) => (
        <Text key={index} style={styles.listItem}>
          {index + 1}. {step}
        </Text>
      ))}

      <CustomButton
        title="Add to Favorites"
        onPress={() => {
          dispatch(addFavorite(recipe));
          Alert.alert('Success', 'Recipe added to favorites.');
        }}
      />

      <CustomButton
        title="Start Cooking"
        onPress={() => {
          dispatch(
            setActiveRecipe({
              recipeName: recipe.strMeal,
              steps: instructionSteps,
            })
          );

          navigation.navigate('CookingProgress');
        }}
        color="#8d6e63"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff8f3',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8f3',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#5d4037',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: 18,
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 8,
  },
  meta: {
    fontSize: 15,
    color: '#6d4c41',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e342e',
    marginTop: 16,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 15,
    color: '#5d4037',
    marginBottom: 6,
    lineHeight: 22,
  },
});