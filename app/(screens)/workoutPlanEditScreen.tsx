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

  // console.log("WP-EDIT", workoutPlan);
  // console.log("EX-Name-EDIT", exerciseNames);
  // console.log("EX-Types-EDIT", exerciseTypes);

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
    if (workoutPlan && exerciseNames && sets) {
      console.log("State fully populated", {
        workoutPlan,
        exerciseNames,
        sets,
      });
      setLoading(false);
    }
  }, [workoutPlan, exerciseNames, sets]);

  const onSetChange = (exerciseId, setIndex, field, value) => {
    setWorkoutPlanState((prevState) => {
      const updatedSets = prevState.sets.map((set) => {
        if (set.exerciseId === exerciseId && set.setIndex === setIndex) {
          return { ...set, [field]: value }; // Update the changed field
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

    try {
      if (workoutPlanName !== workoutPlan?.name) {
        console.log("Updating WP-NAME..", workoutPlanName, workoutPlan?.name);
        await WorkoutPlanService.update(workoutPlan.id, {
          name: workoutPlanName,
        });
      }
      console.log("END-UPDATE-WP-NAME");
      const updatedSetPromises = sets.map(async (set) => {
        if (set.id) {
          const existingSet = await SetService.getById(set.id);
          if (
            existingSet.reps !== set.reps ||
            existingSet.weight !== set.weight
          ) {
            console.log(`Updating SET-ID: ${set.id}`);
            await SetService.update(set.id, {
              reps: set.reps,
              weight: set.weight,
            });
          }
        } else {
          console.log("Creating new set...");
          const newSet = await SetService.create(set);
          set.id = newSet.id;
          workoutPlan.setId.push(newSet.id);
        }
      });

      await Promise.all(updatedSetPromises);

      await WorkoutPlanService.update(workoutPlan.id, {
        setId: workoutPlan.setId,
        exerciseId: workoutPlan.exerciseId,
      });

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
          keyExtractor={(exerciseId) => exerciseId}
          renderItem={renderExerciseItem} // Render each exercise item
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
