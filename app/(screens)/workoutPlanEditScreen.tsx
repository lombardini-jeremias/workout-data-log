import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";

import { ExerciseType } from "../../interfaces/ExerciseType.interface";

import CancelButton from "../../components/navigation/CancelButton";
import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";

import TextOrInput from "../../components/reusables/TextOrInput";
import ExerciseSetsManager from "../../components/reusables/ExerciseSetsManager";

import { SetService } from "../../services/Set.service";
import { WorkoutPlanService } from "../../services/WorkoutPlan.service";
import { useWorkoutPlan } from "../../context/WorkoutPlanProvider";

export default function workoutPlanEditScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const { workoutPlanState, setWorkoutPlanState } = useWorkoutPlan();
  const { workoutPlan, sets, exerciseNames, exerciseTypes } = workoutPlanState;
  const [workoutPlanName, setWorkoutPlanName] = useState(
    workoutPlan?.name || ""
  );

  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelButton onPress={handleCancelButton} />,
      headerRight: () => (
        <RightSecondaryButton title="Update" onPress={handleUpdate} />
      ),
    });
  }, [navigation, workoutPlan, workoutPlanName, workoutPlanState]);

  const handleCancelButton = () => {
    router.back();
  };

  useEffect(() => {
    if (workoutPlan && exerciseNames && sets) {
      console.log("State fully populated", {
        sets,
      });
      setLoading(false);
    }
  }, [workoutPlan, exerciseNames, sets, workoutPlanState]);

  const onSetChange = (exerciseId, setIndex, field, value) => {
    setWorkoutPlanState((prevState) => {
      const updatedSets = prevState.sets.map((set) => {
        if (set.exerciseId === exerciseId && set.setIndex === setIndex) {
          return { ...set, [field]: value }; // Update only the specified field
        }
        return set;
      });

      return { ...prevState, sets: [...updatedSets] }; // Ensure a new array is returned
    });
  };

  const onAddSet = (exerciseId) => {
    setWorkoutPlanState((prevState) => {
      const existingSets = prevState.sets.filter(
        (set) => set.exerciseId === exerciseId
      );

      // Find the maximum setIndex in the existing sets for this exercise
      const maxSetIndex =
        existingSets.length > 0
          ? Math.max(...existingSets.map((set) => set.setIndex))
          : -1;

      // Assign the next higher setIndex for the new set
      const newSetIndex = maxSetIndex + 1;

      let newSet = {
        exerciseId,
        setIndex: newSetIndex, // Ensure unique index by incrementing maxSetIndex
        reps: "",
        weight: "",
        duration: "",
        distance: "",
        exerciseTypeId: exerciseTypes[exerciseId]?.id || "",
      };

      // Optionally pre-fill new set with values from the last set
      if (existingSets.length > 0) {
        const lastSet = existingSets[existingSets.length - 1];
        newSet = {
          ...newSet,
          reps: lastSet.reps ? String(lastSet.reps) : "",
          weight: lastSet.weight ? String(lastSet.weight) : "",
          duration: lastSet.duration ? String(lastSet.duration) : "",
          distance: lastSet.distance ? String(lastSet.distance) : "",
        };
      }

      // Return updated state with the new set added
      return { ...prevState, sets: [...prevState.sets, newSet] };
    });
  };

  // const onDeleteSet = (exerciseId, setIndex) => {
  //   // Create a new array without mutating the previous state
  //   setSets((prevSets) => {
  //     const filteredSets = prevSets.filter(
  //       (set) => !(set.exerciseId === exerciseId && set.index === setIndex)
  //     );

  //     // Map the remaining sets to update their index if necessary
  //     return filteredSets.map((set, index) =>
  //       set.exerciseId === exerciseId ? { ...set, index } : set
  //     );
  //   });
  // };

  // const handleAddExercise = () => {
  //   router.push("/(screens)/personalExerciseListScreen");
  // };

  const handleUpdate = async () => {
    try {
      // Update workout plan name if it has changed
      if (workoutPlanName !== workoutPlan?.name) {
        await WorkoutPlanService.update(workoutPlan.id, {
          name: workoutPlanName,
        });
      }
      console.log("END-UPDATE-WP-NAME");

      // Create an array to store the updated set IDs (both existing and newly created)
      let updatedSetIds = [...(workoutPlan.setId || [])];

      for (const set of workoutPlanState.sets) {
        if (set.id) {
          // Existing set: Check if it needs to be updated
          const storageSet = await SetService.getById(set.id);
          const currentSet = workoutPlanState.sets.find((s) => s.id === set.id);

          if (storageSet && currentSet && needsUpdate(storageSet, currentSet)) {
            await SetService.update(set.id, {
              reps: currentSet.reps,
              weight: currentSet.weight,
              duration: currentSet.duration,
              distance: currentSet.distance,
            });
          }
        } else {
          // New set: Create it and associate it with the workout plan
          const newSet = await SetService.create(set);
          set.id = newSet.id;
          updatedSetIds.push(newSet.id); // Add the new set's ID to the workout plan
        }
      }

      // Update the workout plan with the new set IDs
      await WorkoutPlanService.update(workoutPlan.id, {
        setId: updatedSetIds, // Ensure all set IDs (both existing and new) are stored
        exerciseId: workoutPlan?.exerciseId,
      });

      // Update the workout plan state with the new changes
      setWorkoutPlanState((prevState) => ({
        ...prevState,
        workoutPlan: {
          ...prevState.workoutPlan,
          name: workoutPlanName,
          setId: updatedSetIds, // Make sure the state reflects the new set IDs
          exerciseId: workoutPlan.exerciseId,
        },
        sets: workoutPlanState.sets,
      }));

      console.log("HANDLE-UPDATE-FINISHED");

      Alert.alert("Workout Plan updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating workout plan:", error);
      Alert.alert("Failed to update workout plan. Please try again.");
    }
  };

  const needsUpdate = (storageSet, currentSet) => {
    return (
      (Number(storageSet.reps) || 0) !== (Number(currentSet.reps) || 0) ||
      (Number(storageSet.weight) || 0) !== (Number(currentSet.weight) || 0) ||
      (Number(storageSet.duration) || 0) !==
        (Number(currentSet.duration) || 0) ||
      (Number(storageSet.distance) || 0) !== (Number(currentSet.distance) || 0)
    );
  };

  const handleExerciseDetailById = (exerciseId: string) => {
    router.push({
      pathname: "/(screens)/personalExerciseDetailScreen",
      params: { exerciseId },
    });
  };

  // Render a list of exercises and their sets
  const renderExerciseItem = ({ item: exerciseId }) => {
    const exerciseSets = sets.filter((set) => set.exerciseId === exerciseId);

    return (
      <View key={exerciseId}>
        <TouchableOpacity onPress={() => handleExerciseDetailById(exerciseId)}>
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
            exerciseType={exerciseTypes[exerciseId]?.type || null}
          />
        ) : (
          <Text style={styles.noSetsText}>
            No sets available for this exercise.
          </Text>
        )}
      </View>
    );
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
      <TextOrInput
        isEditable={true}
        value={workoutPlanName}
        onChangeText={(text) => setWorkoutPlanName(text)}
      />

      <View style={styles.separator} />

      <View style={styles.subheaderContainer}>
        <Text style={styles.subheaderText}>Exercises and Sets</Text>
      </View>

      {workoutPlan && workoutPlan.exerciseId.length > 0 ? (
        <FlatList
          data={workoutPlan.exerciseId}
          extraData={sets}
          keyExtractor={(exerciseId) => exerciseId}
          renderItem={renderExerciseItem}
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
