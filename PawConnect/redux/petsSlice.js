import { createSlice } from "@reduxjs/toolkit";

const formatBreedFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const breedPart = parts[4] || "";
    const withSpaces = breedPart.replace(/-/g, " ");
    return withSpaces.replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return "";
  }
};

const petsSlice = createSlice({
  name: "pets",
  initialState: {
    apiImage: null,
    apiBreed: "",
    loading: false,
    error: null,

    pets: [],

    inputName: "",
    inputNote: "",

    editingId: null,
  },
  reducers: {
    fetchPetStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPetSuccess: (state, action) => {
      state.loading = false;
      state.apiImage = action.payload;

      const breed = formatBreedFromUrl(action.payload);
      state.apiBreed = breed;
      if (!state.editingId) {
        state.inputName = breed;
      }
    },
    fetchPetError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setInputName: (state, action) => {
      state.inputName = action.payload;
    },
    setInputNote: (state, action) => {
      state.inputNote = action.payload;
    },

    setEditingId: (state, action) => {
      state.editingId = action.payload;
    },
    clearInputs: (state) => {
      state.inputName = "";
      state.inputNote = "";
    },

    addPet: (state, action) => {
      state.pets.unshift(action.payload);
    },
    removePet: (state, action) => {
      state.pets = state.pets.filter((p) => p.id !== action.payload);
    },
    updatePet: (state, action) => {
      const { id, name, note } = action.payload;
      const pet = state.pets.find((p) => p.id === id);
      if (pet) {
        pet.name = name;
        pet.note = note;
      }
    },
    toggleAdopted: (state, action) => {
      const pet = state.pets.find((p) => p.id === action.payload);
      if (pet) {
        pet.adopted = !pet.adopted;
      }
    },
  },
});

export const {
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
} = petsSlice.actions;

export default petsSlice.reducer;