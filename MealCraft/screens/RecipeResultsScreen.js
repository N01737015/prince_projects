import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  FlatList,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setSelectedRecipe } from '../redux/recipesSlice';

export default function RecipeResultsScreen({ navigation, route }) {
  const dispatch = useDispatch();

  const ingredients = useMemo(() => {
    return route.params?.ingredients || [];
  }, [route.params?.ingredients]);

  const [recipeList, setRecipeList] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [error, setError] = useState('');

  const listOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [listOpacity]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoadingRecipes(true);
        setError('');

        const query = ingredients.length > 0 ? ingredients[0] : 'chicken';

        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        );

        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
          setRecipeList(data.meals);
        } else {
          setRecipeList([]);
          setError(
            'No recipes found. Try using simple ingredients like chicken, beef, egg, rice, or pasta.'
          );
        }
      } catch (err) {
        setError('Failed to load recipes.');
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, [ingredients]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        dispatch(setSelectedRecipe(item));
        navigation.navigate('RecipeDetail', {
          recipeId: item.idMeal,
          recipeName: item.strMeal,
        });
      }}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.strMeal}</Text>
        <Text style={styles.cardText}>Category: {item.strCategory}</Text>
        <Text style={styles.cardText}>Area: {item.strArea}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recipes for your ingredients</Text>

      <Text style={styles.subheading}>
        Searching using: {ingredients.join(', ') || 'chicken'}
      </Text>

      {loadingRecipes ? (
        <ActivityIndicator size="large" color="#6d4c41" />
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Animated.View style={{ opacity: listOpacity, flex: 1 }}>
        <FlatList
          data={recipeList}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            !loadingRecipes ? (
              <Text style={styles.emptyText}>No recipes found.</Text>
            ) : null
          }
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff8f3',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: '#6d4c41',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5d4037',
    marginBottom: 6,
  },
  cardText: {
    color: '#6d4c41',
    marginBottom: 2,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#6d4c41',
  },
});