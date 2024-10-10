import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";

import SaveButton from "../../components/navigation/RightSecondaryButton";
import SecondaryInput from "../../components/inputs/SecondaryInput";
import PrimaryInput from "../../components/inputs/PrimaryInput";
import { preloadAllDataService } from "../../services/preloadData.service";

const formatExerciseName = (name: string) => {
  return name.trim().toUpperCase().replace(/\s+/g, "_");
};

export default function CreateExercise() {
  const navigation = useNavigation();
  const router = useRouter();
  const [newExercise, setNewExercise] = useState("");

  const [equipment, setEquipment] = useState("Select");
  const [muscleGroup, setMuscleGroup] = useState("Select");
  const [exerciseType, setExerciseType] = useState("Select");
  // const [force, setForce] = useState("Select");
  // const [mechanic, setMechanic] = useState("Select");

  const { selectedEquipment, selectedMuscleGroup, selectedExerciseType } =
    useLocalSearchParams();

  console.log("selectedExerciseType", selectedExerciseType);

  useEffect(() => {
    const loadPreloadedData = async () => {
      await preloadAllDataService();
    };
    loadPreloadedData();

    if (selectedEquipment) {
      setEquipment(
        Array.isArray(selectedEquipment)
          ? selectedEquipment[0]
          : selectedEquipment
      );
    }

    if (selectedMuscleGroup) {
      setMuscleGroup(
        Array.isArray(selectedMuscleGroup)
          ? selectedMuscleGroup[0]
          : selectedMuscleGroup
      );
    }

    if (selectedExerciseType) {
      setExerciseType(
        Array.isArray(selectedExerciseType)
          ? selectedExerciseType[0]
          : selectedExerciseType
      );
    }

    // if (selectedForce) {
    //   setForce(Array.isArray(selectedForce) ? selectedForce[0] : selectedForce);
    // }

    // if (selectedMechanic) {
    //   setMechanic(
    //     Array.isArray(selectedMechanic) ? selectedMechanic[0] : selectedMechanic
    //   );
    // }
  }, [selectedEquipment, selectedMuscleGroup, selectedExerciseType]);

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

  const handleSelectingEquipment = () => {
    router.push({
      pathname: "/(screens)/equipmentSelectionScreen",
    });
  };

  const handleSelectingMuscleGroup = () => {
    router.push({
      pathname: "/(screens)/muscleGroupSelectionScreen",
    });
  };

  const handleSelectingExerciseType = () => {
    router.push({
      pathname: "/(screens)/exerciseTypeSelectionScreen",
    });
  };

  // const handleSelectingMechanic = () => {
  //   router.push({
  //     pathname: "/(screens)/mechanicSelectionScreen",
  //   });
  // };

  // const handleSelectingForce = () => {
  //   router.push({
  //     pathname: "/(screens)/forceSelectionScreen",
  //   });
  // };

  return (
    <View style={Containers.screenContainer}>
      <View>
        <PrimaryInput
          placeholder={"Exercise Name"}
          value={newExercise}
          onChangeText={setNewExercise}
        />
        <SecondaryInput
          title={"Equipment Type"}
          onPress={handleSelectingEquipment}
          selectedItem={equipment || "Select"}
        />

        {/* <SecondaryInput
          title={"Force"}
          onPress={handleSelectingForce}
          selectedItem={force || "Select"}
        />

        <SecondaryInput
          title={"Mechanic"}
          onPress={handleSelectingMechanic}
          selectedItem={mechanic || "Select"}
        /> */}

        <SecondaryInput
          title={"Primary Muscle"}
          onPress={handleSelectingMuscleGroup}
          selectedItem={muscleGroup || "Select"}
        />

        <SecondaryInput
          title={"Secondary Muscle"}
          onPress={handleSelectingMuscleGroup}
          selectedItem={muscleGroup || "Select"}
        />

        <SecondaryInput
          title={"Exercise Type"}
          onPress={handleSelectingExerciseType}
          selectedItem={exerciseType || "Select"}
        />
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
