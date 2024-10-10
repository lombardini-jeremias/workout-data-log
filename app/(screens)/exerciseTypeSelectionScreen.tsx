import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { preloadAllDataService } from "../../services/preloadData.service";
import { Containers } from "@/constants/Container";
import { Colors } from "@/constants/Colors";
import { ExerciseTypeService } from "../../services/ExerciseType.service";
import { ExerciseType } from "../../interfaces/ExerciseType.interface";

export default function ExerciseTypeSelectionScreen() {
  const router = useRouter();
  const [exerciseTypeList, setExerciseTypeList] = useState<ExerciseType[]>([]);

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
    router.push({
      pathname: "/(screens)/createExerciseScreen",
      params: { selectedExerciseType: exerciseType.type },
    });
    console.log("selected-exerciseType", exerciseType);
  };

  return (
    <View style={Containers.screenContainer}>
      {exerciseTypeList.map((exerciseType, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelect(exerciseType)}
          style={styles.exerciseTypeItem}
        >
          <Text style={styles.exerciseTypeText}>{exerciseType.type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseTypeItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  exerciseTypeText: {
    fontSize: 18,
    color: Colors.text,
  },
});
