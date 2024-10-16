import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";

import { Set } from "../../interfaces/Set.interface";
import { ExerciseType } from "../../interfaces/ExerciseType.interface";

import CancelButton from "../../components/navigation/CancelButton";
import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";

import TextOrInput from "../../components/reusables/TextOrInput";
import ExerciseSetsManager from "../../components/reusables/ExerciseSetsManager";

import { SetService } from "../../services/Set.service";
import { ExerciseService } from "../../services/Exercise.service";
import { WorkoutPlanService } from "../../services/WorkoutPlan.service";
import { ExerciseTypeService } from "../../services/ExerciseType.service";

export default function workoutPlanEditScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const { workoutPlanId } = useLocalSearchParams<{
    workoutPlanId: string;
  }>();

  const [workoutPlanName, setWorkoutPlanName] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [sets, setSets] = useState<Set[]>([]);
  const [exerciseNames, setExerciseNames] = useState<{ [key: string]: string }>(
    {}
  );
  const [exerciseTypes, setExerciseTypes] = useState<{
    [key: string]: ExerciseType | null;
  }>({});

  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelButton onPress={handleCancelButton} />,
      headerRight: () => (
        <RightSecondaryButton title="Update" onPress={handleUpdate} />
      ),
    });
  }, [navigation, workoutPlan, workoutPlanName]);

  const handleCancelButton = () => {
    router.back();
  };

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

  const onSetChange = (exerciseId, setIndex, field, value) => {
    setSets((prevSets) =>
      prevSets.map((set) => {
        if (set.exerciseId === exerciseId && set.index === setIndex) {
          return { ...set, [field]: value };
        }
        return set;
      })
    );
  };

  const onAddSet = (exerciseId) => {
    const newSet = {
      index: sets.filter((set) => set.exerciseId === exerciseId).length,
      set: sets.length + 1,
      weight: "",
      reps: "",
      exerciseId,
    };
    setSets((prevSets) => [...prevSets, newSet]);
  };

  const onDeleteSet = (exerciseId, setIndex) => {
    // Create a new array without mutating the previous state
    setSets((prevSets) => {
      const filteredSets = prevSets.filter(
        (set) => !(set.exerciseId === exerciseId && set.index === setIndex)
      );

      // Map the remaining sets to update their index if necessary
      return filteredSets.map((set, index) =>
        set.exerciseId === exerciseId ? { ...set, index } : set
      );
    });
  };

  // const handleAddExercise = () => {
  //   router.push("/(screens)/personalExerciseListScreen");
  // };

  const handleUpdate = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem(WORKOUTS_KEY);
      const parsedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];

      const updatedWorkouts = parsedWorkouts.map(
        (workout) => workouts.find((w) => w.uuid === workout.uuid) || workout
      );

      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));

      const storedDayActivities = await AsyncStorage.getItem(
        DAY_ACTIVITIES_KEY
      );
      const parsedDayActivities = storedDayActivities
        ? JSON.parse(storedDayActivities)
        : [];

      const updatedDayActivities = parsedDayActivities.map((activity) =>
        activity.uuid === selectedDayActivityId
          ? { ...activity, name: activityName }
          : activity
      );

      await AsyncStorage.setItem(
        DAY_ACTIVITIES_KEY,
        JSON.stringify(updatedDayActivities)
      );

      Alert.alert("Success", "Day activity and workouts updated.");
      setIsEditable(false); // Reset editable mode
      navigation.goBack();
    } catch (error) {
      console.error("Error updating data:", error);
      Alert.alert("Failed to update data.");
    }
  };

  const handleExerciseDetailById = (exerciseId: string) => {
    router.push({
      pathname: "/(screens)/personalExerciseDetailScreen",
      params: { exerciseId },
    });
  };

  const getExerciseNameById = async (id: string) => {
    const exercise = await ExerciseService.getById(id);
    return exercise?.name || "Unknown Exercise";
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
      <TextOrInput isEditable={true} value={workoutPlanName} />
      <View style={styles.separator} />

      <View style={styles.subheaderContainer}>
        <Text style={styles.subheaderText}>Exercises and Sets</Text>
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
                    isEditable={true}
                    onSetChange={onSetChange}
                    onAddSet={onAddSet}
                    onDeleteSet={onDeleteSet}
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
  inputContainer: {
    paddingTop: 10,
  },
  inputText: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  exerciseText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 16,
    fontStyle: "italic",
    color: Colors.text,
    marginTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
  noWorkoutsText: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.gray,
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
  noSetsText: {
    fontSize: 16,
    color: Colors.gray,
    fontStyle: "italic",
  },
});
