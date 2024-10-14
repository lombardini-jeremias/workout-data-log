import {
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  View,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";

import { Exercise } from "../../interfaces/Exercise.interface";
import { ExerciseService } from "../../services/Exercise.service";
import { EquipmentService } from "../../services/Equipment.service";
import { MuscleGroupService } from "../../services/MuscleGroup.service";
import { ExerciseTypeService } from "../../services/ExerciseType.service";

export default function PersonalExerciseDetailScreen() {
  const { exerciseId } = useLocalSearchParams() as { exerciseId: string };
  const [exercise, setExercise] = useState<Exercise | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for fetched entities
  const [equipment, setEquipment] = useState(null);
  const [primaryMuscleGroup, setPrimaryMuscleGroup] = useState(null);
  const [secondaryMuscleGroup, setSecondaryMuscleGroup] = useState(null);
  const [exerciseType, setExerciseType] = useState(null);

  useEffect(() => {
    const loadExerciseDetails = async () => {
      if (!exerciseId) {
        setError("Invalid exercise ID");
        setLoading(false);
        return;
      }

      try {
        const foundExercise = await ExerciseService.getById(exerciseId);
        if (foundExercise) {
          setExercise(foundExercise);
          // Fetch associated data
          const fetchedEquipment = await EquipmentService.getById(
            foundExercise.equipmentId
          );
          setEquipment(fetchedEquipment);

          const fetchedPrimaryMuscleGroup = await MuscleGroupService.getById(
            foundExercise.primaryMuscleGroupId
          );
          setPrimaryMuscleGroup(fetchedPrimaryMuscleGroup);

          const fetchedSecondaryMuscleGroup = await MuscleGroupService.getById(
            foundExercise.secondaryMuscleGroupId
          );
          setSecondaryMuscleGroup(fetchedSecondaryMuscleGroup);

          const fetchedExerciseType = await ExerciseTypeService.getById(
            foundExercise.exerciseTypeId
          );
          setExerciseType(fetchedExerciseType);
        } else {
          setError("Exercise not found");
        }
      } catch (error) {
        console.error("Error fetching exercise details:", error);
        setError("An error occurred while fetching exercise details");
      } finally {
        setLoading(false);
      }
    };

    loadExerciseDetails();
  }, [exerciseId]);

  if (loading) {
    return (
      <View style={Containers.screenContainer}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading exercise details...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={Containers.screenContainer}>
      <ScrollView>
        {exercise ? (
          <>
            <View style={Containers.titleContainer}>
              <Text style={styles.title}>{exercise.name}</Text>
            </View>
            <View>
              <Text style={styles.nameText}>Equipment:</Text>
              <Text style={styles.detailText}>
                {equipment ? equipment.name : "Loading..."}
              </Text>

              <Text style={styles.nameText}>Primary Muscles:</Text>

              <Text style={styles.detailText}>
                {primaryMuscleGroup ? primaryMuscleGroup.name : "Loading..."}
              </Text>

              <Text style={styles.nameText}>Secondary Muscles:</Text>
              <Text style={styles.detailText}>
                {secondaryMuscleGroup ? secondaryMuscleGroup.name : "None"}
              </Text>

              <Text style={styles.nameText}>Exercise Type:</Text>
              <Text style={styles.detailText}>
                {exerciseType ? exerciseType.type : "Loading..."}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.noExerciseText}>Exercise not found</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  detailText: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 5,
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
