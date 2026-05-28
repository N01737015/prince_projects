import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

export default function PetCard({ pet, onToggle, onEdit, onDelete }) {
  return (
    <View style={[styles.card, pet.adopted ? styles.adopted : styles.interested]}>
      <Image source={{ uri: pet.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.note}>{pet.note || "No note added."}</Text>
        <Text style={styles.status}>
          Status: {pet.adopted ? "Adopted ✅" : "Interested ⭐"}
        </Text>

        <View style={styles.row}>
          <Pressable style={styles.btn} onPress={onToggle}>
            <Text style={styles.btnText}>{pet.adopted ? "Unmark" : "Adopt"}</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={onEdit}>
            <Text style={styles.btnText}>Edit</Text>
          </Pressable>

          <Pressable style={styles.btnDanger} onPress={onDelete}>
            <Text style={styles.btnText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  interested: { borderColor: "#273c75" },
  adopted: { borderColor: "#44bd32" },

  image: { width: 90, height: 90, borderRadius: 12 },

  info: { flex: 1, marginLeft: 10 },

  name: { color: "#2f3640", fontSize: 16, fontWeight: "800" },
  note: { color: "#57606f", marginTop: 4 },
  status: { color: "#718093", marginTop: 6, fontSize: 12 },

  row: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },

  btn: {
    backgroundColor: "#273c75",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  btnDanger: {
    backgroundColor: "#c23616",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  btnText: { color: "#ffffff", fontWeight: "700" },
});