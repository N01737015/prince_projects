import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  nextCookingStep,
  previousCookingStep,
  resetCookingSteps,
  markMealCooked,
  setTotalSteps,
} from '../redux/favoritesSlice';
import ProgressBar from '../components/ProgressBar';
import CustomButton from '../components/CustomButton';

export default function CookingProgressScreen({ route, navigation }) {
  const dispatch = useDispatch();

  const {
    currentStep,
    totalSteps,
    cookedMeals,
    weeklyGoal,
    activeRecipeName,
    activeRecipeSteps,
  } = useSelector((state) => state.favorites);

  const steps = useMemo(() => {
    if (route.params?.steps && route.params.steps.length > 0) {
      return route.params.steps;
    }

    return activeRecipeSteps || [];
  }, [route.params?.steps, activeRecipeSteps]);

  const recipeName =
    route.params?.recipeName || activeRecipeName || 'Selected Recipe';

  const hasRecipe = recipeName !== 'Selected Recipe' && steps.length > 0;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const stepCount = steps.length > 0 ? steps.length : 1;
    dispatch(setTotalSteps(stepCount));
  }, [dispatch, steps]);

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep, pulseAnim, slideAnim]);

  const currentInstruction =
    steps.length > 0 ? steps[currentStep - 1] : 'No cooking steps available.';

  const stepPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  const weeklyPercent =
    weeklyGoal > 0 ? Math.min((cookedMeals / weeklyGoal) * 100, 100) : 0;

  const showMessage = (title, message, onOk) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(
        title,
        message,
        onOk ? [{ text: 'OK', onPress: onOk }] : undefined
      );
    }
  };

  const handleNextStep = () => {
    if (!hasRecipe) {
      showMessage(
        'No Recipe Selected',
        'Please choose a recipe and tap Start Cooking first.'
      );
      return;
    }

    if (currentStep < totalSteps) {
      dispatch(nextCookingStep());
    } else {
      showMessage('Done', 'You are already on the last step.');
    }
  };

  const handlePreviousStep = () => {
    if (!hasRecipe) {
      showMessage(
        'No Recipe Selected',
        'Please choose a recipe and tap Start Cooking first.'
      );
      return;
    }

    if (currentStep > 1) {
      dispatch(previousCookingStep());
    } else {
      showMessage('Info', 'You are already on the first step.');
    }
  };

  const handleResetSteps = () => {
    if (!hasRecipe) {
      showMessage(
        'No Recipe Selected',
        'Please choose a recipe and tap Start Cooking first.'
      );
      return;
    }

    dispatch(resetCookingSteps());
  };

  const handleMarkCooked = () => {
    if (!hasRecipe) {
      showMessage(
        'No Recipe Selected',
        'Please choose a recipe and tap Start Cooking first.'
      );
      return;
    }

    if (currentStep === totalSteps) {
      dispatch(markMealCooked());

      showMessage('Success', 'Meal marked as cooked.', () => {
        if (Platform.OS === 'web') {
          navigation.replace('Home');
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      });
    } else {
      showMessage(
        'Complete All Steps',
        'Please finish all recipe steps before marking the meal as cooked.'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: pulseAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>{recipeName}</Text>
        <Text style={styles.subtitle}>Track your cooking progress</Text>

        <ProgressBar
          progress={stepPercent}
          label={`Recipe Steps: ${currentStep}/${totalSteps}`}
        />

        <View style={styles.stepCard}>
          <Text style={styles.stepHeading}>Current Step</Text>
          <Text style={styles.stepText}>{currentInstruction}</Text>
        </View>

        <ProgressBar
          progress={weeklyPercent}
          label={`Weekly Goal: ${cookedMeals}/${weeklyGoal}`}
          barColor="#6d4c41"
        />

        <CustomButton title="Next Step" onPress={handleNextStep} />

        <CustomButton
          title="Previous Step"
          onPress={handlePreviousStep}
          color="#8d6e63"
        />

        <CustomButton
          title="Reset Steps"
          onPress={handleResetSteps}
          color="#a1887f"
        />

        <CustomButton
          title="Mark Meal Cooked"
          onPress={handleMarkCooked}
          color="#5d4037"
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff8f3',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6d4c41',
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginVertical: 14,
  },
  stepHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 15,
    color: '#5d4037',
    lineHeight: 24,
  },
});