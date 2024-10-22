import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";

import BackButton from "@/components/navigation/BackButton";
import TextOrInput from "@/components/reusables/TextOrInput";
import ExerciseSetsManager from "@/components/reusables/ExerciseSetsManager";

import { ExerciseService } from "../../services/Exercise.service";

import { useWorkoutPlan } from "../../context/WorkoutPlanProvider";

export default function WorkoutPlanDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const { workoutPlanState } = useWorkoutPlan();
  const { workoutPlan, sets, exerciseNames, exerciseTypes } = workoutPlanState;
  console.log("WP-STATE-DETAIL-SCREEN", workoutPlanState);

  const { workoutPlanId } = useLocalSearchParams() as { workoutPlanId: string };
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (workoutPlan && workoutPlan.id === workoutPlanId) {
        setLoading(false);
      } else {
        Alert.alert("Workout Plan not found.");
      }
    }, [workoutPlan, workoutPlanId, workoutPlanState])
  );

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

  const handleEditWorkoutPlan = () => {
    router.push({
      pathname: "/(screens)/workoutPlanEditScreen",
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
      <TextOrInput isEditable={false} value={workoutPlan?.name || ""} />
      <View style={styles.separator} />

      <View style={styles.subheaderContainer}>
        <Text style={styles.subheaderText}>Exercises and Sets</Text>
        <TouchableOpacity onPress={() => handleEditWorkoutPlan()}>
          <Text style={styles.subheaderButton}>Edit Workout Plan</Text>
        </TouchableOpacity>
      </View>

      {workoutPlan && workoutPlan.exerciseId.length > 0 ? (
        <FlatList
          data={workoutPlan.exerciseId}
          keyExtractor={(exerciseId) => exerciseId}
          renderItem={({ item: exerciseId }) => {
            const exerciseSets =
              sets?.filter((set) => set.exerciseId === exerciseId) || [];

            return (
              <View key={exerciseId}>
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
