import React, { useEffect, useLayoutEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";

import PrimaryInput from "../../components/inputs/PrimaryInput";
import SecondaryInput from "../../components/inputs/SecondaryInput";
import SaveButton from "../../components/navigation/RightSecondaryButton";

import { ExerciseService } from "../../services/Exercise.service";
import { preloadAllDataService } from "../../services/preloadData.service";

import { useExerciseForm } from "../../context/ExerciseFormProvider";

export default function CreateExerciseScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { exerciseForm, setExerciseForm } = useExerciseForm();

  // const [equipment, setEquipment] = useState<Equipment["name"] | string>(
  //   "Select"
  // );
  // const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState<
  //   MuscleGroup["name"] | string
  // >("Select");
  // const [secondaryMuscleGroup, setSecondaryMuscleGroup] = useState<
  //   MuscleGroup["name"] | string
  // >("Select");
  // const [exerciseType, setExerciseType] = useState<
  //   ExerciseType["type"] | string
  // >("Select");

  // const {
  //   selectedEquipment,
  //   selectedPrimaryMuscleGroup,
  //   selectedSecondaryMuscleGroup,
  //   selectedExerciseType,
  // } = useLocalSearchParams();

  useEffect(() => {
    const loadPreloadedData = async () => {
      await preloadAllDataService();
    };
    loadPreloadedData();

    // if (selectedEquipment) {
    //   setEquipment(
    //     Array.isArray(selectedEquipment)
    //       ? selectedEquipment[0]
    //       : selectedEquipment
    //   );
    // }

    // if (selectedPrimaryMuscleGroup) {
    //   setPrimaryMuscleGroup(
    //     Array.isArray(selectedPrimaryMuscleGroup)
    //       ? selectedPrimaryMuscleGroup[0]
    //       : selectedPrimaryMuscleGroup
    //   );
    // }

    // if (selectedSecondaryMuscleGroup) {
    //   setSecondaryMuscleGroup(
    //     Array.isArray(selectedSecondaryMuscleGroup)
    //       ? selectedSecondaryMuscleGroup[0]
    //       : selectedSecondaryMuscleGroup
    //   );
    // }

    // if (selectedExerciseType) {
    //   setExerciseType(
    //     Array.isArray(selectedExerciseType)
    //       ? selectedExerciseType[0]
    //       : selectedExerciseType
    //   );
    // }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <SaveButton title={"Save"} onPress={handleSave} />,
    });
  }, [navigation, exerciseForm]);

  const handleSave = async () => {
    const { name, equipmentName, primaryMuscleGroupName, exerciseTypeName } =
      exerciseForm;

    if (!name || name.trim() === "") {
      Alert.alert("Please enter a name for the exercise");
      return;
    }
    if (equipmentName === "Select") {
      Alert.alert("Please select equipment");
      return;
    }
    if (primaryMuscleGroupName === "Select") {
      Alert.alert("Please select a primary muscle group");
      return;
    }
    if (exerciseTypeName === "Select") {
      Alert.alert("Please select an exercise type");
      return;
    }

    const formattedExercise = {
      name: exerciseForm.name.trim(),
      equipmentId: exerciseForm.equipmentId,
      primaryMuscleGroupId: exerciseForm.primaryMuscleGroupId,
      secondaryMuscleGroupId: exerciseForm.secondaryMuscleGroupId,
      exerciseTypeId: exerciseForm.exerciseTypeId,
    };

    try {
      const savedExercise = await ExerciseService.create(formattedExercise);
      console.log("Newly created exercise:", savedExercise);

      Alert.alert("Success", "Exercise created successfully!");
      setExerciseForm({
        ...exerciseForm,
        name: "",
      });

      navigation.goBack();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert(
          "Unknown Error",
          "An unknown error occurred while saving the exercise."
        );
      }
    }
  };

  const handleSelectingEquipment = () => {
    setExerciseForm({
      ...exerciseForm,
      name: exerciseForm.name.trim(),
    });
    router.push("/(screens)/equipmentSelectionScreen");
  };

  const handleSelectingMuscleGroup = () => {
    setExerciseForm({
      ...exerciseForm,
      name: exerciseForm.name.trim(),
    });
    router.push("/(screens)/muscleGroupSelectionScreen");
  };

  const handleSecondarySelectingMuscleGroup = () => {
    setExerciseForm({
      ...exerciseForm,
      name: exerciseForm.name.trim(),
    });
    router.push("/(screens)/muscleGroupSecondarySelectionScreen");
  };

  const handleSelectingExerciseType = () => {
    setExerciseForm({
      ...exerciseForm,
      name: exerciseForm.name.trim(),
    });
    router.push("/(screens)/exerciseTypeSelectionScreen");
  };

  return (
    <View style={Containers.screenContainer}>
      <View>
        <PrimaryInput
          placeholder={"Exercise Name"}
          value={exerciseForm.name}
          onChangeText={(text) =>
            setExerciseForm({ ...exerciseForm, name: text })
          }
        />
        <SecondaryInput
          title={"Equipment Type"}
          onPress={handleSelectingEquipment}
          selectedItem={exerciseForm.equipmentName || "Select"}
        />
        <SecondaryInput
          title={"Primary Muscle"}
          onPress={handleSelectingMuscleGroup}
          selectedItem={exerciseForm.primaryMuscleGroupName || "Select"}
        />

        <SecondaryInput
          title={"Secondary Muscle"}
          onPress={handleSecondarySelectingMuscleGroup}
          selectedItem={exerciseForm.secondaryMuscleGroupName || "Select"}
        />

        <SecondaryInput
          title={"Exercise Type"}
          onPress={handleSelectingExerciseType}
          selectedItem={exerciseForm.exerciseTypeName || "Select"}
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
