import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import CustomButton from '../components/CustomButton';
import ProgressBar from '../components/ProgressBar';

export default function HomeScreen({ navigation }) {
  const [loadingTip, setLoadingTip] = useState(true);
  const [cookingTip, setCookingTip] = useState('');

  const {
    cookedMeals,
    weeklyGoal,
    activeRecipeName,
    activeRecipeSteps,
  } = useSelector((state) => state.favorites);

  const weeklyPercent =
    weeklyGoal > 0 ? Math.min((cookedMeals / weeklyGoal) * 100, 100) : 0;

  const hasActiveRecipe = activeRecipeName && activeRecipeSteps.length > 0;

  useEffect(() => {
    const tips = [
      'Always let meat rest before cutting to keep juices in.',
      'Salt your pasta water generously — it should taste like the sea.',
      'Use a sharp knife; dull knives cause more accidents.',
      'Mise en place: prep all ingredients before you start cooking.',
      'Taste your food as you cook, not just at the end.',
    ];

    const random = tips[Math.floor(Math.random() * tips.length)];

    setTimeout(() => {
      setCookingTip(random);
      setLoadingTip(false);
    }, 1000);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Your cooking companion</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cooking Tip of the Day</Text>
        {loadingTip ? (
          <ActivityIndicator size="large" color="#6d4c41" />
        ) : (
          <Text style={styles.tipText}>{cookingTip}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Goal Progress</Text>
        <ProgressBar
          progress={weeklyPercent}
          label={`${cookedMeals} of ${weeklyGoal} meals completed`}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Cooking</Text>
        <Text style={styles.tipText}>
          {hasActiveRecipe
            ? `In progress: ${activeRecipeName}`
            : 'No recipe currently in progress.'}
        </Text>
      </View>

      <CustomButton
        title="Manage Ingredients"
        onPress={() => navigation.navigate('Ingredients')}
      />

      <CustomButton
        title="View Favorites"
        onPress={() => navigation.navigate('Favorites')}
        color="#8d6e63"
      />

      <CustomButton
        title="Cooking Progress"
        onPress={() => navigation.navigate('CookingProgress')}
        color="#a1887f"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff8f3',
  },
  heroCard: {
    backgroundColor: '#6d4c41',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#efebe9',
    marginTop: 8,
    fontSize: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5d4037',
  },
});