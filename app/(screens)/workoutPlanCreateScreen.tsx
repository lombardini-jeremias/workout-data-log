import { Text, View, Alert, StyleSheet, FlatList } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";

import CancelButton from "../../components/navigation/CancelButton";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";
import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";

import TextOrInput from "../../components/reusables/TextOrInput";
import ExerciseSetsManager2 from "../../components/reusables/ExerciseSetsManager2";

import { SetService } from "../../services/Set.service";
import { WorkoutPlanService } from "../../services/WorkoutPlan.service";
import { ExerciseTypeService } from "../../services/ExerciseType.service";
import ExerciseSetsManager from "../../components/reusables/ExerciseSetsManager";

export default function workoutPlanCreateScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [activityName, setActivityName] = useState("");
  const { selectedExercises: selectedExercisesString } = useLocalSearchParams();
  const [selectedExercises, setSelectedExercises] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelButton onPress={handleCancelButton} />,
      headerRight: () => (
        <RightSecondaryButton title="Save" onPress={handleSave} />
      ),
    });
  }, [navigation, activityName]);

  useEffect(() => {
    if (typeof selectedExercisesString === "string") {
      try {
        const exercisesArray = JSON.parse(selectedExercisesString);

        // Fetch exerciseType for each exercise
        const fetchExerciseDetails = async () => {
          const exercisesWithDetails = await Promise.all(
            exercisesArray.map(async (exercise) => {
              const fetchedExerciseType = await ExerciseTypeService.getById(
                exercise.exerciseTypeId
              );

              return {
                ...exercise,
                exerciseType: fetchedExerciseType,
                sets: [{ set: 1, weight: "", reps: "" }],
              };
            })
          );

          setSelectedExercises(exercisesWithDetails);
        };

        fetchExerciseDetails();
      } catch (error) {
        console.error("Failed to parse or fetch exercises", error);
      }
    }
  }, [selectedExercisesString]);

  const handleCancelButton = () => {
    router.push({ pathname: "/(tabs)/workout" });
  };

  const onSetChange = (exerciseId, setIndex, field, value) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const updatedSets = exercise.sets.map((set, index) =>
            index === setIndex ? { ...set, [field]: value } : set
          );
          return { ...exercise, sets: updatedSets };
        }
        return exercise;
      })
    );
  };

  const onAddSet = (exerciseId) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: [
              ...exercise.sets,
              { set: exercise.sets.length + 1, weight: "", reps: "" },
            ],
          };
        }
        return exercise;
      })
    );
  };

  const onDeleteSet = (exerciseId, setIndex) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          // Remove the set at the specified index
          const updatedSets = exercise.sets.filter(
            (_, index) => index !== setIndex
          );
          return { ...exercise, sets: updatedSets };
        }
        return exercise;
      })
    );
  };

  // Main function to handle the save process
  const handleSave = async () => {
    if (!activityName.trim()) {
      Alert.alert("Please enter a Name for the Day Activity");
      return;
    }

    try {
      // Step 1: Save all sets for the selected exercises and get exercise IDs
      const { exerciseIds, allSetIds } = await saveAllExercisesAndSets();
      // Step 2: Save the workout plan
      await saveWorkoutPlan(exerciseIds, allSetIds);

      Alert.alert("Workout saved successfully!");
      router.push({ pathname: "/(tabs)/workout" });
    } catch (error) {
      console.error("Error saving workout", error);
      Alert.alert("An error occurred. Please try again.");
    }
  };

  // Function to save all exercises and their sets
  const saveAllExercisesAndSets = async () => {
    const exerciseIds = [];
    const allSetIds = [];

    for (const exercise of selectedExercises) {
      try {
        const exerciseId = exercise.id;
        // Save sets for the current exercise
        const setIds = await saveSetsForExercise(exercise);

        exerciseIds.push(exerciseId);
        allSetIds.push(...setIds);
      } catch (error) {
        console.error(
          `Error saving sets for exercise: ${exercise.name}`,
          error
        );
        throw error;
      }
    }

    return { exerciseIds, allSetIds };
  };

  const saveSetsForExercise = async (exercise) => {
    const setIds = [];

    for (const set of exercise.sets) {
      try {
        const newSet = prepareSetData(exercise, set);

        const savedSet = await SetService.create(newSet);
        console.log("SAVED-SET", savedSet);

        setIds.push(savedSet.id);
      } catch (error) {
        console.error(
          `Error saving set for exercise: ${exercise.name}, Set: ${set.setIndex}`,
          error
        );
        throw error;
      }
    }

    return setIds;
  };

  // Function to prepare the set data for saving
  const prepareSetData = (exercise, set) => {
    console.log("SET-PreparedSet", set);
    return {
      exerciseId: exercise.id,
      setIndex: set.set,
      reps: set.reps ? parseInt(set.reps, 10) : undefined,
      weight: set.weight ? parseFloat(set.weight) : undefined,
      duration: set.duration ? parseInt(set.duration, 10) : undefined,
      distance: set.distance ? parseFloat(set.distance) : undefined,
      restTime: set.restTime ? parseInt(set.restTime, 10) : undefined,
      rpe: set.rpe ? parseInt(set.rpe, 10) : undefined,
      exerciseTypeId: exercise.exerciseTypeId,
    };
  };

  // Function to save the workout plan
  const saveWorkoutPlan = async (exerciseIds, setIds) => {
    try {
      const workoutPlan = {
        name: activityName,
        exerciseId: exerciseIds,
        setId: setIds,
      };

      await WorkoutPlanService.create(workoutPlan);
    } catch (error) {
      console.error("Error saving workout plan", error);
      throw error;
    }
  };

  return (
    <View style={Containers.screenContainer}>
      <TextOrInput
        isEditable={true}
        value={activityName}
        placeholder="Workout Plan Name"
        onChangeText={(text) => setActivityName(text)}
      />
      <View style={styles.separator} />

      <FlatList
        data={selectedExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <ExerciseSetsManager2
              isEditable={true}
              exercise={item}
              // exercise={{ id: exerciseId, sets: exerciseSets }}
              exerciseType={item.exerciseType?.type || null}
              onSetChange={onSetChange}
              onAddSet={onAddSet}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noExercisesText}>
            Start adding an Exercise to the Day Activity.
          </Text>
        }
      />

      <ButtonSecondary
        title="+ Add Exercise"
        onPress={() => router.push("/(screens)/personalExerciseListScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
  exerciseName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noExercisesText: {
    color: Colors.gray,
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});
