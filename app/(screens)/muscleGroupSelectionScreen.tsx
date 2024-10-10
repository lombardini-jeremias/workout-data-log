import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { preloadAllDataService } from "../../services/preloadData.service";
import { Containers } from "@/constants/Container";
import { Colors } from "@/constants/Colors";

export default function MuscleGroupSelectionScreen() {
  const navigation = useNavigation();
  const [muscleGroupList, setMuscleGroupList] = useState([]);

  useEffect(() => {
    const loadPreloadedData = async () => {
      const data = await preloadAllDataService();
      setMuscleGroupList(data.muscleGroups); // Assuming preloadAllDataService returns muscle groups
    };
    loadPreloadedData();
  }, []);

  const handleSelect = (muscleGroup) => {
    // Handle selection logic
    navigation.goBack(); // Or handle accordingly
  };

  return (
    <View style={Containers.screenContainer}>
      {muscleGroupList.map((muscleGroup, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelect(muscleGroup)}
          style={styles.muscleGroupItem}
        >
          <Text style={styles.muscleGroupText}>{muscleGroup.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
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
