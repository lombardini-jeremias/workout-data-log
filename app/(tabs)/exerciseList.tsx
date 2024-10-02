import React, { useState, useLayoutEffect, useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import exercisesData from "../../db/exercises.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Exercise } from "../../interfaces/Exercise.interfaces";
import { Containers } from "../../constants/Container";
import SearchBar from "../../components/SearchBar";

const loadUserExercisesFromStorage = async () => {
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
  const router = useRouter();
  const { fromScreen } = useLocalSearchParams();

  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);

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
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push("CreateExerciseScreen")}
          style={{ marginRight: 20 }}
        >
          <Ionicons name="add" size={26} color={Colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter((exercise: Exercise) =>
        exercise.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  };

  const handleSelectExercise = (exercise: Exercise) => {
    if (fromScreen === "WorkoutForm") {
      router.push({
        pathname: "CreateExerciseScreen",
        params: {
          selectedExercise: {
            id: exercise.id,
            name: exercise.name,
          },
        },
      });
    } else {
      router.push({
        pathname: "ExerciseDetailScreen",
        params: {
          exerciseId: exercise.id,
        },
      });
    }
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
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectExercise(item)}>
            <ThemedView style={styles.exerciseItem}>
              <ThemedText style={styles.exerciseText}>{item.name}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <ThemedText style={styles.noExerciseText}>
            No exercises found
          </ThemedText>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.text,
  },
  exerciseText: {
    fontSize: 16,
    color: Colors.text,
  },
  noExerciseText: {
    paddingTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: Colors.gray,
  },
});
