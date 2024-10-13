import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Containers } from "@/constants/Container";
import { Colors } from "@/constants/Colors";
import { ExerciseTypeService } from "../../services/ExerciseType.service";
import { ExerciseType } from "../../interfaces/ExerciseType.interface";
import { useExerciseForm } from "../../context/ExerciseFormProvider";

export default function ExerciseTypeSelectionScreen() {
  const router = useRouter();
  const [exerciseTypeList, setExerciseTypeList] = useState<ExerciseType[]>([]);
  const { setExerciseForm } = useExerciseForm();

  useEffect(() => {
    const loadPreloadedData = async () => {
      try {
        const fetchData = await ExerciseTypeService.getAll();
        setExerciseTypeList(fetchData);
      } catch (error) {
        console.error("Error loading exercise types data", error);
      }
    };
    loadPreloadedData();
  }, []);

  const handleSelect = (exerciseType: ExerciseType) => {
    setExerciseForm((prev) => ({
      ...prev,
      exerciseTypeId: exerciseType.id,
      exerciseTypeName: exerciseType.type,
    }));
    router.back();
  };

  return (
    <ScrollView style={Containers.screenContainer}>
      {exerciseTypeList.map((exerciseType, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelect(exerciseType)}
          style={styles.exerciseTypeItem}
        >
          <Text style={styles.exerciseTypeText}>{exerciseType.type}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  exerciseTypeItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  exerciseTypeText: {
    fontSize: 18,
    color: Colors.text,
  },
});
