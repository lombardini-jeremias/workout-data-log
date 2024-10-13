import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Containers } from "@/constants/Container";
import { Colors } from "@/constants/Colors";
import { MuscleGroup } from "../../interfaces/MuscleGroup.interface";
import { MuscleGroupService } from "../../services/MuscleGroup.service";
import { useExerciseForm } from "../../context/ExerciseFormProvider";

export default function MuscleGroupSelectionScreen() {
  const router = useRouter();
  const [muscleGroupList, setMuscleGroupList] = useState<MuscleGroup[]>([]);
  const { setExerciseForm } = useExerciseForm();

  useEffect(() => {
    const loadPreloadedData = async () => {
      try {
        const fetchData = await MuscleGroupService.getAll();
        setMuscleGroupList(fetchData);
      } catch (error) {
        console.error("Error loading muscle groups data", error);
      }
    };
    loadPreloadedData();
  }, []);

  const handleSelect = (primaryMuscleGroup: MuscleGroup) => {
    setExerciseForm((prev) => ({
      ...prev,
      primaryMuscleGroupId: primaryMuscleGroup.id, // Set UUID
      primaryMuscleGroupName: primaryMuscleGroup.name, // Set name for display
    }));
    router.back();
  };

  return (
    <ScrollView style={Containers.screenContainer}>
      {muscleGroupList.map((primaryMuscleGroup, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelect(primaryMuscleGroup)}
          style={styles.muscleGroupItem}
        >
          <Text style={styles.muscleGroupText}>{primaryMuscleGroup.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  muscleGroupItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  muscleGroupText: {
    fontSize: 18,
    color: Colors.text,
  },
});
