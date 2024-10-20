import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
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
    console.log("SET-CHANGE-triggered:", {
      exerciseId,
      setIndex,
      field,
      value,
    });
    setWorkoutPlanState((prevState) => {
      const updatedSets = prevState.sets.map((set) => {
        if (set.exerciseId === exerciseId && set.setIndex === setIndex) {
          return { ...set, [field]: value };
        }
        return set;
      });

      return { ...prevState, sets: updatedSets };
    });
  };

  const onAddSet = (exerciseId) => {
    setWorkoutPlanState((prevState) => {
      const newSetIndex = prevState.sets.filter(
        (set) => set.exerciseId === exerciseId
      ).length;

      const newSet = {
        exerciseId,
        setIndex: newSetIndex,
        reps: "",
        weight: "",
        exerciseTypeId: exerciseTypes[exerciseId]?.id || "",
      };

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
    console.log("Updating WP-ID:", workoutPlan.id);
    console.log("WP-STATE-AFTER-1-NAME", workoutPlanState.sets);

    try {
      // Update workout plan name if it has changed
      if (workoutPlanName !== workoutPlan?.name) {
        console.log("Updating WP-NAME..", workoutPlanName, workoutPlan?.name);
        await WorkoutPlanService.update(workoutPlan.id, {
          name: workoutPlanName,
        });
      }
      console.log("END-UPDATE-WP-NAME");

      const updatedSetPromises = workoutPlanState.sets.map(async (set) => {
        // Use workoutPlanState.sets
        console.log(`STATE-SET-ID: ${set.id}`, set);

        if (set.id) {
          const storageSet = await SetService.getById(set.id);
          console.log(`FETCHED-STORED-SETS:`, storageSet);

          // Find the current set in workoutPlanState
          const currentSet = workoutPlanState.sets.find((s) => s.id === set.id);
          console.log(`CURRENT-STATE-SETS-TO-EDIT:`, currentSet);

          // Ensure currentSet exists before comparison
          if (!currentSet) {
            console.error(
              `No matching set found in state for SET-ID: ${set.id}`
            );
            return;
          }

          const needsUpdate =
            (Number(storageSet.reps) || 0) !== (Number(currentSet.reps) || 0) ||
            (Number(storageSet.weight) || 0) !==
              (Number(currentSet.weight) || 0) ||
            (Number(storageSet.duration) || 0) !==
              (Number(currentSet.duration) || 0) ||
            (Number(storageSet.distance) || 0) !==
              (Number(currentSet.distance) || 0);

          console.log("Needs Update:", needsUpdate);

          if (needsUpdate) {
            console.log(`Updating SET-ID: ${set.id}`);
            await SetService.update(set.id, {
              reps: currentSet.reps,
              weight: currentSet.weight,
              duration: currentSet.duration,
              distance: currentSet.distance,
            });
          }
          console.log("END-UPDATING-SET-VALUES");
        } else {
          console.log("Creating new set...");
          const newSet = await SetService.create(set);
          set.id = newSet.id; // Ensure we are updating the local state with new ID
          workoutPlan.setId.push(newSet.id);
          console.log("END-CREATING-SET", newSet);
        }
      });
      await Promise.all(updatedSetPromises);
      console.log("END-UPDATING-SET");

      await WorkoutPlanService.update(workoutPlan.id, {
        setId: workoutPlan?.setId,
        exerciseId: workoutPlan?.exerciseId,
      });

      // Update the WP-STATE after the updates
      setWorkoutPlanState((prevState) => ({
        ...prevState,
        workoutPlan: {
          ...prevState.workoutPlan,
          name: workoutPlanName,
          setId: workoutPlan.setId,
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
      <View>
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

// const updatedSetPromises = sets.map(async (set) => {
//   console.log(`Processing SET-ID: ${set.id}`, set);

//   if (set.id) {
//     const existingSet = await SetService.getById(set.id);
//     if (
//       existingSet.reps !== set.reps ||
//       existingSet.weight !== set.weight ||
//       existingSet.duration !== set.duration ||
//       existingSet.distance !== set.distance
//     ) {
//       console.log(`Updating SET-ID: ${set.id}`);

//       await SetService.update(set.id, {
//         reps: set.reps,
//         weight: set.weight,
//         duration: set.duration,
//         distance: set.distance,
//       });
//     }
//     console.log("END-UPDATING-SET-VALUES");
//   } else {
//     console.log("Creating new set...");
//     const newSet = await SetService.create(set);
//     set.id = newSet.id;
//     workoutPlan.setId.push(newSet.id);
//     console.log("END-CREATING-SET", newSet);
//   }
//   console.log("END-UPDATEING-SET");
// });
