import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/store";
import PetCard from "./components/PetCard";

import {
  fetchPetStart,
  fetchPetSuccess,
  fetchPetError,
  setInputName,
  setInputNote,
  setEditingId,
  clearInputs,
  addPet,
  removePet,
  updatePet,
  toggleAdopted,
} from "./redux/petsSlice";

function Main() {
  const dispatch = useDispatch();
  const {
    apiImage,
    apiBreed,
    loading,
    error,
    pets,
    inputName,
    inputNote,
    editingId,
  } = useSelector((state) => state.pets);

  const fetchRandomDog = async () => {
    try {
      dispatch(fetchPetStart());
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await res.json();
      dispatch(fetchPetSuccess(data.message));
    } catch (e) {
      dispatch(fetchPetError("Failed to fetch dog image. Try again."));
    }
  };

  const handleSavePet = () => {
    if (!apiImage) {
      Alert.alert("Fetch first", "Press 'Fetch Random Dog' to get an image.");
      return;
    }
    if (!inputName.trim()) {
      Alert.alert("Missing name", "Enter a pet name before saving.");
      return;
    }

    const newPet = {
      id: Date.now().toString(),
      image: apiImage,
      name: inputName.trim(),
      note: inputNote.trim(),
      adopted: false,
      breed: apiBreed,
    };

    dispatch(addPet(newPet));
    dispatch(clearInputs());
    dispatch(setEditingId(null));
  };

  const startEditing = (pet) => {
    dispatch(setInputName(pet.name));
    dispatch(setInputNote(pet.note));
    dispatch(setEditingId(pet.id));
    Alert.alert("Editing mode", "Change inputs then press 'Update Selected'.");
  };

  const handleUpdateSelected = () => {
    if (!editingId) {
      Alert.alert("No selection", "Tap Edit on a saved pet first.");
      return;
    }
    if (!inputName.trim()) {
      Alert.alert("Missing name", "Name cannot be empty.");
      return;
    }

    dispatch(
      updatePet({
        id: editingId,
        name: inputName.trim(),
        note: inputNote.trim(),
      })
    );

    dispatch(clearInputs());
    dispatch(setEditingId(null));
    Alert.alert("Updated ✅", "Saved pet updated.");
  };

  const cancelEditing = () => {
    dispatch(clearInputs());
    dispatch(setEditingId(null));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.page}>
          <Text style={styles.header}>Prince PawConnect 🐾</Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Random Dog (API)</Text>

            <Pressable
              style={styles.btnPrimary}
              onPress={fetchRandomDog}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? "Fetching..." : "Fetch Random Dog"}
              </Text>
            </Pressable>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {apiImage ? (
              <>
                <View style={styles.imageBox}>
                  <Image source={{ uri: apiImage }} style={styles.previewImage} />
                </View>
                {apiBreed ? <Text style={styles.breed}>Breed: {apiBreed}</Text> : null}
              </>
            ) : (
              <Text style={styles.muted}>No image yet. Press Fetch.</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              {editingId ? "Edit Saved Pet" : "Save to Adoption Notes"}
            </Text>

            <TextInput
              value={inputName}
              onChangeText={(t) => dispatch(setInputName(t))}
              placeholder="Pet Name (auto-filled from breed)"
              placeholderTextColor="#888"
              style={styles.input}
            />

            <TextInput
              value={inputNote}
              onChangeText={(t) => dispatch(setInputNote(t))}
              placeholder="Note (e.g., Calm, friendly, good with kids)"
              placeholderTextColor="#888"
              style={[styles.input, { height: 70 }]}
              multiline
            />

            <View style={styles.row}>
              <Pressable style={styles.btnPrimary} onPress={handleSavePet}>
                <Text style={styles.btnText}>Save Pet</Text>
              </Pressable>

              <Pressable style={styles.btnSecondary} onPress={handleUpdateSelected}>
                <Text style={styles.btnText}>Update Selected</Text>
              </Pressable>

              <Pressable style={styles.btnDanger} onPress={cancelEditing}>
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Saved Pets</Text>

            <FlatList
              data={pets}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PetCard
                  pet={item}
                  onToggle={() => dispatch(toggleAdopted(item.id))}
                  onEdit={() => startEditing(item)}
                  onDelete={() => dispatch(removePet(item.id))}
                />
              )}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.muted}>No saved pets yet. Fetch + Save one.</Text>
              }
            />
          </View>

          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  scrollContent: {
    padding: 12,
  },
  page: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 900,
  },
  header: {
    color: "#1e272e",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    color: "#2f3640",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  muted: {
    color: "#718093",
    marginTop: 8,
  },
  error: {
    color: "#e84118",
    marginTop: 8,
  },

  imageBox: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "#f1f2f6",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  breed: {
    marginTop: 8,
    color: "#2f3640",
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#f1f2f6",
    color: "#2f3640",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    flexWrap: "wrap",
  },
  btnPrimary: {
    backgroundColor: "#273c75",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  btnSecondary: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  btnDanger: {
    backgroundColor: "#c23616",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  btnText: {
  color: "#ffffff",
  fontWeight: "700",
  fontSize: 14,
  letterSpacing: 0.5,
  },
});