import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";

import BackButton from "@/components/navigation/BackButton";
import TextOrInput from "@/components/reusables/TextOrInput";
import ExerciseSetsManager from "@/components/reusables/ExerciseSetsManager";

import { Set } from "@/interfaces/Set.interface";
import { WorkoutPlan } from "@/interfaces/WorkoutPlan.interface";
import { ExerciseType } from "@/interfaces/ExerciseType.interface";

import { SetService } from "../../services/Set.service";
import { ExerciseService } from "../../services/Exercise.service";
import { WorkoutPlanService } from "../../services/WorkoutPlan.service";
import { ExerciseTypeService } from "../../services/ExerciseType.service";

export default function WorkoutPlanDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const { workoutPlanId } = useLocalSearchParams() as { workoutPlanId: string };
  // maybe i can fetch the name when i fetch getAll() workoutPlan

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [workoutPlanName, setWorkoutPlanName] = useState<string>("");

  const [sets, setSets] = useState<Set[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<{
    [key: string]: ExerciseType | null;
  }>({});

  const [loading, setLoading] = useState(true);
  const [exerciseNames, setExerciseNames] = useState<{ [key: string]: string }>(
    {}
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchWorkoutPlanDetails = async () => {
      try {
        const selectedWorkoutPlan = await WorkoutPlanService.getById(
          workoutPlanId
        );

        if (selectedWorkoutPlan) {
          setWorkoutPlan(selectedWorkoutPlan);
          setWorkoutPlanName(selectedWorkoutPlan.name);
          const setsForPlan = await Promise.all(
            selectedWorkoutPlan.setId.map((setId) => SetService.getById(setId))
          );
          setSets(setsForPlan.filter((set) => set !== undefined) as Set[]);

          // Fetch exercise names
          const names: { [key: string]: string } = {};
          await Promise.all(
            selectedWorkoutPlan.exerciseId.map(async (exerciseId) => {
              const name = await getExerciseNameById(exerciseId);
              names[exerciseId] = name;
            })
          );
          setExerciseNames(names);

          // Fetch exercise types for the sets
          const exerciseTypesMap: { [key: string]: ExerciseType | null } = {};
          await Promise.all(
            setsForPlan.map(async (set) => {
              if (set?.exerciseTypeId && set?.exerciseId) {
                const exerciseType = await ExerciseTypeService.getById(
                  set.exerciseTypeId
                );
                exerciseTypesMap[set.exerciseId] = exerciseType;
              }
            })
          );

          setExerciseTypes(exerciseTypesMap);
        } else {
          Alert.alert("Workout Plan not found.");
        }
      } catch (error) {
        console.error("Error fetching workout plan:", error);
        Alert.alert("Failed to fetch workout plan.");
      } finally {
        setLoading(false);
      }
    };

    if (workoutPlanId) {
      fetchWorkoutPlanDetails();
    }
  }, [workoutPlanId]);

  const getExerciseNameById = async (id: string) => {
    const exercise = await ExerciseService.getById(id);
    return exercise?.name || "Unknown Exercise";
  };

  const handleExerciseDetailById = (exerciseId: string) => {
    router.push({
      pathname: "/(screens)/personalExerciseDetailScreen",
      params: { exerciseId },
    });
  };

  const handleEditWorkoutPlan = (workoutPlanId: string) => {
    router.push({
      pathname: "/(screens)/workoutPlanEditScreen",
      params: { workoutPlanId },
    });
  };

  if (loading) {
    return (
      <View style={Containers.screenContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={Containers.screenContainer}>
      <TextOrInput isEditable={false} value={workoutPlanName} />
      <View style={styles.separator} />

      <View style={styles.subheaderContainer}>
        <Text style={styles.subheaderText}>Exercises and Sets</Text>
        <TouchableOpacity onPress={() => handleEditWorkoutPlan(workoutPlanId)}>
          <Text style={styles.subheaderButton}>Edit Workout Plan</Text>
        </TouchableOpacity>
      </View>

      {workoutPlan && workoutPlan.exerciseId.length > 0 ? (
        <FlatList
          data={workoutPlan.exerciseId}
          keyExtractor={(exerciseId) => exerciseId}
          renderItem={({ item: exerciseId }) => {
            const exerciseSets = sets.filter(
              (set) => set.exerciseId === exerciseId
            );

            return (
              <View>
                <TouchableOpacity
                  onPress={() => handleExerciseDetailById(exerciseId)}
                >
                  <Text style={styles.exerciseText}>
                    {exerciseNames?.[exerciseId] || "Unknown Exercise"}
                  </Text>
                </TouchableOpacity>

                {exerciseSets.length > 0 ? (
                  <ExerciseSetsManager
                    exercise={{ id: exerciseId, sets: exerciseSets }}
                    isEditable={false}
                    onSetChange={() => {}}
                    onAddSet={() => {}}
                    exerciseType={exerciseTypes[exerciseId]?.type || null}
                  />
                ) : (
                  <Text style={styles.noSetsText}>
                    No sets available for this exercise.
                  </Text>
                )}
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.noWorkoutsText}>
          No exercises found for this Workout Plan.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
  subheaderContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  subheaderText: {
    fontSize: 18,
    flex: 1,
    color: Colors.gray,
  },
  subheaderButton: {
    fontSize: 18,
    color: "#2196F3",
  },
  exerciseText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: "bold",
  },
  noWorkoutsText: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.gray,
  },
  noSetsText: {
    fontSize: 16,
    color: Colors.gray,
    fontStyle: "italic",
  },
});
