import React, { useLayoutEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";
import { useNavigation } from "expo-router";
import SaveButton from "../../components/navigation/RightSecondaryButton";
import SecondaryInput from "../../components/inputs/SecondaryInput";
import PrimaryInput from "../../components/inputs/PrimaryInput";

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
    //   if (!newExercise) {
    //     Alert.alert("Please enter a name for the exercise");
    //     return;
    //   }
    //   const formattedName = formatExerciseName(newExercise);
    //   const newUserExercise = { id: uuidv4(), name: formattedName };
    //   try {
    //     const jsonValue = await AsyncStorage.getItem("userExercises");
    //     const userExercises = jsonValue != null ? JSON.parse(jsonValue) : [];
    //     const exerciseExists = userExercises.some(
    //       (exercise) => exercise.name === formattedName
    //     );
    //     if (exerciseExists) {
    //       Alert.alert("Exercise already exists!");
    //       return;
    //     }
    //     // Add new exercise to the list
    //     const updatedUserExercises = [...userExercises, newUserExercise];
    //     // Save updated list to AsyncStorage
    //     await saveUserExercisesToStorage(updatedUserExercises);
    //     Alert.alert("Exercise saved!");
    //     // Clear the input field
    //     setNewExercise("");
    //     navigation.goBack();
    //   } catch (error) {
    //     console.error("Error loading or saving exercises", error);
    //   }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <SaveButton title={"Save"} onPress={addExercise} />,
    });
  }, [navigation]);

  const handleSave = () => {
    // if (!newExercise) {
    //   Alert.alert("Please enter a name for the exercise");
    //   return;
    // }
    // const formattedName = formatExerciseName(newExercise);
    // const newUserExercise = { id: uuidv4(), name: formattedName };
    // try {
    //   const jsonValue = await AsyncStorage.getItem("userExercises");
    //   const userExercises = jsonValue != null ? JSON.parse(jsonValue) : [];
    //   const exerciseExists = userExercises.some(
    //     (exercise) => exercise.name === formattedName
    //   );
    //   if (exerciseExists) {
    //     Alert.alert("Exercise already exists!");
    //     return;
    //   }
    //   // Add new exercise to the list
    //   const updatedUserExercises = [...userExercises, newUserExercise];
    //   // Save updated list to AsyncStorage
    //   await saveUserExercisesToStorage(updatedUserExercises);
    //   Alert.alert("Exercise saved!");
    //   // Clear the input field
    //   setNewExercise("");
    //   navigation.goBack();
    // } catch (error) {
    //   console.error("Error loading or saving exercises", error);
    // }
  };

  const handleSelectEquipment = () => {};

  return (
    <View style={Containers.screenContainer}>
      <View>
        <PrimaryInput
          placeholder={"Exercise Name"}
          value={newExercise}
          onChangeText={setNewExercise}
        />
        <SecondaryInput title={"Equipment"} onPress={handleSelectEquipment} />

        <SecondaryInput title={"Force"} onPress={handleSelectEquipment} />

        <SecondaryInput title={"Level"} onPress={handleSelectEquipment} />

        <SecondaryInput title={"Mechanic"} onPress={handleSelectEquipment} />

        <SecondaryInput
          title={"Primary Muscle"}
          onPress={handleSelectEquipment}
        />

        <SecondaryInput
          title={"Primary Muscle"}
          onPress={handleSelectEquipment}
        />

        <SecondaryInput title={"Category"} onPress={handleSelectEquipment} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
