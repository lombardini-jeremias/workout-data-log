import React, { useState } from "react";
import { TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { useNavigation } from "expo-router";

const saveUserExercisesToStorage = async (exercises) => {
  try {
    const jsonValue = JSON.stringify(exercises);
    await AsyncStorage.setItem("userExercises", jsonValue);
    console.log("EX-LOCAL-STORAGE: ", exercises);
  } catch (error) {
    console.error("Error saving user exercises", error);
  }
};

const formatExerciseName = (name: string) => {
  return name.trim().toUpperCase().replace(/\s+/g, "_");
};

export default function CreateExercise() {
  const navigation = useNavigation();
  const [newExercise, setNewExercise] = useState("");

  const addExercise = async () => {
    if (!newExercise) {
      Alert.alert("Please enter a name for the exercise");
      return;
    }
    const formattedName = formatExerciseName(newExercise);

    const newUserExercise = { id: uuidv4(), name: formattedName };
    try {
      const jsonValue = await AsyncStorage.getItem("userExercises");
      const userExercises = jsonValue != null ? JSON.parse(jsonValue) : [];

      const exerciseExists = userExercises.some(
        (exercise) => exercise.name === formattedName
      );
      if (exerciseExists) {
        Alert.alert("Exercise already exists!");
        return;
      }
      // Add new exercise to the list
      const updatedUserExercises = [...userExercises, newUserExercise];
      // Save updated list to AsyncStorage
      await saveUserExercisesToStorage(updatedUserExercises);
      Alert.alert("Exercise saved!");
      // Clear the input field
      setNewExercise("");
      navigation.goBack();
    } catch (error) {
      console.error("Error loading or saving exercises", error);
    }
  };

  return (
    <ThemedView style={Containers.screenContainer}>
      <ThemedText style={styles.title}>Add a New Exercise</ThemedText>

      <ThemedView style={styles.inputContainer}>
        <ThemedText style={styles.label}>Exercise Name:</ThemedText>
        <TextInput
          style={styles.inputText}
          placeholder="Exercise Name"
          placeholderTextColor={Colors.text}
          value={newExercise}
          onChangeText={setNewExercise}
        />

        <TouchableOpacity style={styles.saveButton} onPress={addExercise}>
          <ThemedText style={styles.saveButtonText}>Add Exercise</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 8,
    color: Colors.text,
  },
  inputContainer: {
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
  },
  inputText: {
    borderWidth: 1,
    borderColor: Colors.text,
    padding: 10,
    borderRadius: 5,
    textAlign: "left",
    backgroundColor: Colors.dark.background,
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.dark.button,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
});
