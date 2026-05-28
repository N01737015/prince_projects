import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import CustomButton from '../components/CustomButton';

export default function IngredientsScreen({ navigation }) {
  const [ingredients, setIngredients] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editText, setEditText] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const addIngredient = () => {
    const trimmed = inputText.trim();

    if (!trimmed) {
      Alert.alert('Input Required', 'Please enter an ingredient.');
      return;
    }

    setIngredients([...ingredients, trimmed]);
    setInputText('');
  };

  const deleteIngredient = (index) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this ingredient?'
      );

      if (confirmed) {
        setIngredients((prevIngredients) =>
          prevIngredients.filter((_, i) => i !== index)
        );
      }
    } else {
      Alert.alert(
        'Delete Ingredient',
        'Are you sure you want to delete this ingredient?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setIngredients((prevIngredients) =>
                prevIngredients.filter((_, i) => i !== index)
              );
            },
          },
        ]
      );
    }
  };

  const openEdit = (index) => {
    setEditIndex(index);
    setEditText(ingredients[index]);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    const trimmed = editText.trim();

    if (!trimmed) {
      Alert.alert('Input Required', 'Ingredient cannot be empty.');
      return;
    }

    const updated = [...ingredients];
    updated[editIndex] = trimmed;
    setIngredients(updated);
    setEditModalVisible(false);
    setEditText('');
    setEditIndex(null);
  };

  const renderIngredient = ({ item, index }) => (
    <View style={styles.ingredientRow}>
      <Text style={styles.ingredientText}>{item}</Text>

      <View style={styles.rowButtons}>
        <View style={styles.buttonHalf}>
          <CustomButton title="Edit" onPress={() => openEdit(index)} />
        </View>

        <View style={styles.buttonHalf}>
          <CustomButton
            title="Delete"
            onPress={() => deleteIngredient(index)}
            color="#a1887f"
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Ingredients</Text>

      <Text style={styles.helperText}>
        Add simple ingredients like chicken, pasta, egg, rice, or beef for better recipe results.
      </Text>

      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="Add an ingredient..."
        style={styles.input}
      />

      <CustomButton title="Add Ingredient" onPress={addIngredient} />

      <CustomButton
        title="Find Recipes"
        onPress={() =>
          navigation.navigate('RecipeResults', { ingredients: ingredients })
        }
        color="#5d4037"
      />

      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <FlatList
          data={ingredients}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={renderIngredient}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No ingredients added yet.</Text>
          }
        />
      </Animated.View>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Ingredient</Text>

            <TextInput
              value={editText}
              onChangeText={setEditText}
              placeholder="Edit ingredient"
              style={styles.input}
            />

            <CustomButton title="Save Changes" onPress={saveEdit} />
            <CustomButton
              title="Close"
              onPress={() => {
                setEditModalVisible(false);
                setEditText('');
                setEditIndex(null);
              }}
              color="#a1887f"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f3',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#6d4c41',
    marginBottom: 12,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bcaaa4',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  ingredientRow: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
  },
  ingredientText: {
    fontSize: 17,
    color: '#4e342e',
    marginBottom: 8,
    fontWeight: '600',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonHalf: {
    flex: 1,
    marginHorizontal: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6d4c41',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e342e',
    marginBottom: 10,
  },
});