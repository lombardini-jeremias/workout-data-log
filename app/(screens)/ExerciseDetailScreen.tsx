import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import exercisesData from "../../db/exercises.json";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { Exercise } from "../../interfaces/Exercise.interfaces";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";

export default function ExerciseDetailScreen() {
  const { exerciseId } = useLocalSearchParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExerciseDetails = () => {
      const exerciseIdNumber = Array.isArray(exerciseId)
        ? Number(exerciseId[0])
        : Number(exerciseId);
      if (isNaN(exerciseIdNumber)) {
        setError("Invalid exercise ID");
        setLoading(false);
        return;
      }

      const foundExercise = exercisesData.exercises.find(
        (exercise) => exercise.id === exerciseIdNumber
      );

      if (foundExercise) {
        setExercise({
          ...foundExercise,
          force: foundExercise.force as "pull" | "push" | "static",
        } as Exercise);
      } else {
        setError("Exercise not found");
      }
      setLoading(false);
    };

    loadExerciseDetails();
  }, [exerciseId]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <ThemedText style={styles.loadingText}>
          Loading exercise details...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView>
      {exercise ? (
        <>
          <ThemedText style={styles.title}>{exercise.name}</ThemedText>
          <ThemedText style={styles.detailText}>
            Force: {exercise.force}
          </ThemedText>
          <ThemedText style={styles.detailText}>
            Level: {exercise.level}
          </ThemedText>
          <ThemedText style={styles.detailText}>
            Mechanic: {exercise.mechanic || "N/A"}
          </ThemedText>
          <ThemedText style={styles.detailText}>
            Equipment: {exercise.equipment}
          </ThemedText>
          <ThemedText style={styles.detailText}>
            Primary Muscles: {exercise.primaryMuscles.join(", ")}
          </ThemedText>
          <ThemedText style={styles.detailText}>
            Secondary Muscles: {exercise.secondaryMuscles.join(", ") || "None"}
          </ThemedText>
          <ThemedText style={styles.detailText}>
            Category: {exercise.category}
          </ThemedText>

          <ThemedText style={styles.instructionsTitle}>
            Instructions:
          </ThemedText>
          {exercise.instructions.map((instruction, index) => (
            <ThemedText key={index} style={styles.instructionText}>
              {index + 1}. {instruction}
            </ThemedText>
          ))}
        </>
      ) : (
        <ThemedText style={styles.noExerciseText}>
          Exercise not found
        </ThemedText>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.text,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.text,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: Colors.text,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
    color: Colors.text,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: "center",
  },
  loadingText: {
    color: Colors.text,
    marginTop: 10,
  },
  noExerciseText: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.lightGray,
  },
});
