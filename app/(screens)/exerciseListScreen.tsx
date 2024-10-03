import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import exercisesData from "../../db/exercises.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { Exercise } from "../../interfaces/Exercise.interfaces";
import { Containers } from "../../constants/Container";
import SearchBar from "../../components/navigation/SearchBar";
import CreateButton from "../../components/navigation/CreateButton";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";

const loadUserExercisesFromStorage = async (): Promise<Exercise[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem("userExercises");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error loading user exercises", error);
    return [];
  }
};

export default function ExerciseList() {
  const navigation = useNavigation();

  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadExercises = async () => {
        const userExercises = await loadUserExercisesFromStorage();
        const allExercises = [...exercisesData.exercises, ...userExercises];
        setExercises(allExercises);
        setFilteredExercises(allExercises);
      };
      loadExercises();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <CreateButton title="Create" onPress={handleCreate} />,
    });
  }, [navigation]);

  const handleCreate = () => {
    navigation.navigate("createExerciseScreen");
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  };

  const handleSelectExercise = (exercise: Exercise) => {
    if (selectedExercises.some((selected) => selected.id === exercise.id)) {
      setSelectedExercises((prev) =>
        prev.filter((item) => item.id !== exercise.id)
      );
    } else {
      setSelectedExercises((prev) => [...prev, exercise]);
    }
  };

  const handleAddExercises = () => {
    console.log("Selected exercises:", selectedExercises);
    // Add logic to proceed with selected exercises
  };

  return (
    <View style={Containers.screenContainer}>
      <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />

      <FlatList
        data={filteredExercises}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: Exercise) => item.id.toString()}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        renderItem={({ item }) => {
          const isSelected = selectedExercises.some(
            (exercise) => exercise.id === item.id
          );
          return (
            <TouchableOpacity onPress={() => handleSelectExercise(item)}>
              <View style={styles.exerciseItem}>
                {isSelected && <View style={styles.selectedIndicator} />}
                <Text style={styles.exerciseText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.noExerciseText}>No exercises found</Text>
        }
      />

      {selectedExercises.length > 0 && (
        <View style={styles.addButtonContainer}>
          <ButtonSecondary title="Add Exercise" onPress={handleAddExercises} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    flexDirection: "row",
    borderColor: Colors.text,
  },
  exerciseText: {
    fontSize: 18,
    color: Colors.text,
  },
  selectedIndicator: {
    width: 5,
    height: "100%",
    backgroundColor: "#2196F3",
    marginRight: 10,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  noExerciseText: {
    paddingTop: 20,
    fontSize: 18,
    textAlign: "center",
    color: Colors.gray,
  },
});
