import {
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  View,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import exercisesData from "../../db/exercises.json";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { Exercise } from "../../interfaces/Exercise.interface";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { Containers } from "../../constants/Container";

export default function ExerciseDetailScreen() {
  const { exerciseId } = useLocalSearchParams() as { exerciseId: string };

  const [exercise, setExercise] = useState<Exercise | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExerciseDetails = () => {
      if (!exerciseId) {
        setError("Invalid exercise ID");
        setLoading(false);
        return;
      }

      // WE ONLY SEARCH ON .JSON FILE, NOT on PERSONALEXERCISES
      const foundExercise: Exercise = exercisesData.exercises.find(
        (exercise) => exercise.id === exerciseId
      );

      if (foundExercise) {
        setExercise(foundExercise);
      } else {
        setError("Exercise not found");
      }
      setLoading(false);
    };

    loadExerciseDetails();
  }, [exerciseId]);

  if (loading) {
    return (
      <View style={Containers.screenContainer}>
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText style={styles.loadingText}>
            Loading exercise details...
          </ThemedText>
        </ThemedView>
      </View>
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
    <View style={Containers.screenContainer}>
      <ScrollView>
        {exercise ? (
          <>
            <View style={Containers.titleContainer}>
              <ThemedText type="title">{exercise.name}</ThemedText>
            </View>
            <View>
              <ThemedText type="defaultSemiBold">
                Force: <Text style={styles.detailText}>{exercise.force}</Text>
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                Level: <Text style={styles.detailText}>{exercise.level} </Text>
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                Mechanic:{" "}
                <Text style={styles.detailText}>
                  {" "}
                  {exercise.mechanic || "N/A"}
                </Text>
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                Equipment:{" "}
                <Text style={styles.detailText}> {exercise.equipment}</Text>
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                Primary Muscles:{" "}
                <Text style={styles.detailText}>
                  {exercise.primaryMuscles.join(", ")}{" "}
                </Text>
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                Secondary Muscles:{" "}
                <Text style={styles.detailText}>
                  {" "}
                  {exercise.secondaryMuscles.join(", ") || "None"}
                </Text>
              </ThemedText>
              <ThemedText type="defaultSemiBold">
                Category:{" "}
                <Text style={styles.detailText}>{exercise.category} </Text>
              </ThemedText>
            </View>

            <View style={styles.containerInstruction}>
              <ThemedText type="subtitle">Instructions:</ThemedText>
              {exercise.instructions.map((instruction, index) => (
                <ThemedText key={index} style={styles.instructionText}>
                  {index + 1}. {instruction}
                </ThemedText>
              ))}
            </View>
          </>
        ) : (
          <ThemedText style={styles.noExerciseText}>
            Exercise not found
          </ThemedText>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  detailText: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 5,
    color: Colors.text,
  },
  containerInstruction: {
    marginTop: 20,
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
    backgroundColor: Colors.dark.background,
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
    color: Colors.gray,
  },
});
