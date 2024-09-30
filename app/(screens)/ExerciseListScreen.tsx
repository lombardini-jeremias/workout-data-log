import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
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

const loadUserExercisesFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("userExercises");
    console.log("LOADED EX");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error loading user exercises", error);
    return [];
  }
};

export default function ExerciseListScreen() {
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
        const allExercises: any = [
          ...exercisesData.exercises,
          ...userExercises,
        ];
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
          onPress={() => (router as any).push("CreateExerciseScreen")}
          style={{ marginRight: 20 }}
        >
          <Ionicons name="add" size={24} color={Colors.text} />
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
    console.log(exercise.id);
    if (fromScreen === "WorkoutForm") {
      (router as any).push({
        pathname: "CreateExerciseScreen",
        params: {
          selectedExercise: {
            id: exercise.id,
            name: exercise.name,
          },
        },
      });
    } else {
      (router as any).push({
        pathname: "ExerciseDetailScreen",
        params: {
          exerciseId: exercise.id,
        },
      });
    }
  };

  return (
    <ThemedView style={Containers.screenContainer}>
      <FlatList
        data={filteredExercises}
        keyExtractor={(item: Exercise) => item.id.toString()}
        initialNumToRender={30}
        maxToRenderPerBatch={30}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectExercise(item)}>
            <ThemedView style={styles.exerciseItem}>
              <ThemedText style={styles.exerciseText}>{item.name}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <ThemedView style={styles.fixedHeader}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercise..."
              placeholderTextColor={Colors.text}
              autoCorrect={false}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </ThemedView>
        }
        ListEmptyComponent={
          <ThemedText style={styles.noExerciseText}>
            No exercises found
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fixedHeader: {
    padding: 10,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: Colors.text,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: Colors.background,
    color: Colors.text,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: Colors.text,
  },
  exerciseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.text,
    marginTop: 10,
  },
  exerciseText: {
    fontSize: 16,
    color: Colors.text,
  },
  noExerciseText: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.lightGray,
  },
});
