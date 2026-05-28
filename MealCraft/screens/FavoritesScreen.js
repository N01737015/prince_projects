import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite } from '../redux/favoritesSlice';
import CustomButton from '../components/CustomButton';

export default function FavoritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const favoriteRecipes = useSelector((state) => state.favorites.favoriteRecipes);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />

      <Text style={styles.title}>{item.strMeal}</Text>
      <Text style={styles.text}>
        {item.strCategory} • {item.strArea}
      </Text>

      <CustomButton
        title="Open Detail"
        onPress={() =>
          navigation.navigate('RecipeDetail', {
            recipeId: item.idMeal,
            recipeName: item.strMeal,
          })
        }
      />

      <CustomButton
        title="Remove Favorite"
        onPress={() => dispatch(removeFavorite(item.idMeal))}
        color="#a94442"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Favorite Recipes</Text>

      <FlatList
        data={favoriteRecipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No favorites added yet.</Text>
        }
      />
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
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5d4037',
  },
  text: {
    color: '#6d4c41',
    marginVertical: 8,
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    color: '#6d4c41',
  },
});