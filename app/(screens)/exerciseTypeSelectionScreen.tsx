import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { preloadAllDataService } from "../../services/preloadData.service";
import { Containers } from "@/constants/Container";
import { Colors } from "@/constants/Colors";

export default function ExerciseTypeSelectionScreen() {
  const navigation = useNavigation();
  const [exerciseTypeList, setExerciseTypeList] = useState([]);

  useEffect(() => {
    const loadPreloadedData = async () => {
      const data = await preloadAllDataService();
      setExerciseTypeList(data.exerciseTypes); // Assuming preloadAllDataService returns exercise types
    };
    loadPreloadedData();
  }, []);

  const handleSelect = (exerciseType) => {
    // Handle selection logic
    navigation.goBack(); // Or handle accordingly
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
