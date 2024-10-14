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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { Exercise } from "../../interfaces/Exercise.interface";
import { Containers } from "../../constants/Container";
import SearchBar from "../../components/navigation/SearchBar";
import CreateButton from "../../components/navigation/CreateButton";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";
import { ExerciseService } from "../../services/Exercise.service";

export default function PersonalExerciseListScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadExercises = async () => {
        const personalExercises = await ExerciseService.getAll();
        setExercises(personalExercises);
        setFilteredExercises(personalExercises);
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
    router.push({
      pathname: "/(screens)/createExerciseScreen",
    });
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
    router.push({
      pathname: "/(screens)/createDayActivityScreen",
      params: { selectedExercises: JSON.stringify(selectedExercises) },
    });
  };

  const handleExerciseDetails = (exerciseId: string) => {
    router.push({
      pathname: "/(screens)/personalExerciseDetailScreen",
      params: { exerciseId },
    });
  };

  return (
    <View style={Containers.screenContainer}>
      <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />

      <FlatList
        data={filteredExercises}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: Exercise) => item.id}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        renderItem={({ item }) => {
          const isSelected = selectedExercises.some(
            (exercise) => exercise.id === item.id
          );
          return (
            <View
              key={item.id}
              style={[
                styles.exerciseItemContainer,
                isSelected && styles.selectedExerciseItemContainer,
              ]}
            >
              <TouchableOpacity
                onPress={() => handleSelectExercise(item)}
                style={{ flex: 0.9 }}
              >
                <View style={styles.exerciseItem}>
                  <Text style={styles.exerciseText}>{item.name}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleExerciseDetails(item.id)}
                style={styles.iconContainer}
              >
                <Ionicons
                  name="ellipsis-horizontal-circle-outline"
                  size={24}
                  color={Colors.text}
                />
              </TouchableOpacity>
            </View>
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
  exerciseItemContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: Colors.text,
  },
  selectedExerciseItemContainer: {
    paddingLeft: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#2196F3",
    borderRadius: 5,
  },
  exerciseText: {
    fontSize: 18,
    color: Colors.text,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    flex: 0.1,
    alignItems: "flex-end",
    paddingLeft: 15,
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
