import { Text, View, Alert, StyleSheet, FlatList } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";
import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";
import CancelButton from "../../components/navigation/CancelButton";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";
import TextOrInput from "../../components/reusables/TextOrInput";
import ExerciseSetsManager from "../../components/reusables/ExerciseSetsManager";
import { ExerciseTypeService } from "../../services/ExerciseType.service";
import { SetService } from "../../services/Set.service";
import { WorkoutPlanService } from "../../services/WorkoutPlan.service";

export default function CreateDayActivityScreen() {
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
                sets: [{ set: 1, kg: "", reps: "" }],
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
              { set: exercise.sets.length + 1, kg: "", reps: "" },
            ],
          };
        }
        return exercise;
      })
    );
  };

  // const handleSave = async () => {
  //   if (!activityName.trim()) {
  //     Alert.alert("Please enter a Name for the Day Activity");
  //     return;
  //   }

  //   try {
  //     // Array to hold all the exercise IDs used in this workout
  //     const exerciseIds = [];
  //     // Array to hold all the set IDs created for this workout plan
  //     const allSetIds = [];

  //     // Step 1: Iterate through selected exercises and save their sets
  //     for (const exercise of selectedExercises) {
  //       const exerciseId = exercise.id;
  //       // Array to store all created set IDs for the current exercise
  //       const setIds = [];
  //       for (const set of exercise.sets) {
  //         const newSet = {
  //           exerciseId: exerciseId,
  //           setIndex: set.set,
  //           reps: set.reps ? parseInt(set.reps, 10) : undefined,
  //           weight: set.kg ? parseFloat(set.kg) : undefined,
  //           duration: set.duration ? parseInt(set.duration, 10) : undefined,
  //           distance: set.distance ? parseFloat(set.distance) : undefined,
  //           restTime: set.restTime ? parseInt(set.restTime, 10) : undefined,
  //           rpe: set.rpe ? parseInt(set.rpe, 10) : undefined,
  //           exerciseTypeId: exercise.exerciseTypeId,
  //         };
  //         // Save the set
  //         const savedSet = await SetService.create(newSet);
  //         console.log("SAVED-SET", savedSet);
  //         // Add the set ID to the setIds array for the current exercise
  //         setIds.push(savedSet.id);
  //         // Also add the set ID to the allSetIds array for the workout plan
  //         allSetIds.push(savedSet.id);
  //       }
  //       // After saving sets, store the exerciseId in the workout plan
  //       exerciseIds.push(exerciseId);
  //     }
  //     // Step 2: Create the WorkoutPlan after all sets and exercises have been saved
  //     const workoutPlan = {
  //       name: activityName, // The name of the workout
  //       exerciseId: exerciseIds, // Array of all exercise IDs used in this workout
  //       setId: allSetIds, // Array of all set IDs created for this workout
  //     };
  //     // Save the WorkoutPlan
  //     await WorkoutPlanService.create(workoutPlan);

  //     Alert.alert("Workout saved successfully!");
  //     router.push({ pathname: "/(tabs)/workout" });
  //   } catch (error) {
  //     console.error("Error saving workout", error);
  //     Alert.alert("An error occurred. Please try again.");
  //   }
  // };

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

      // Success message
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

        // Store the exercise ID and all set IDs
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

  // Function to save sets for a specific exercise
  const saveSetsForExercise = async (exercise) => {
    const setIds = [];

    for (const set of exercise.sets) {
      try {
        // Prepare the set data to be saved
        const newSet = prepareSetData(exercise, set);

        // Save the set
        const savedSet = await SetService.create(newSet);
        console.log("SAVED-SET", savedSet);

        // Add the saved set ID to the list
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
    return {
      exerciseId: exercise.id,
      setIndex: set.set,
      reps: set.reps ? parseInt(set.reps, 10) : undefined,
      weight: set.kg ? parseFloat(set.kg) : undefined,
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

      // Save the workout plan
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
        placeholder="Day Activity Name"
        onChangeText={(text) => setActivityName(text)}
      />
      <View style={styles.separator} />

      <FlatList
        data={selectedExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <ExerciseSetsManager
              isEditable={true}
              exercise={item}
              exerciseType={item.exerciseType?.type}
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

// import { Text, View, Alert, StyleSheet, FlatList } from "react-native";
// import React, { useLayoutEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import "react-native-get-random-values";
// import { v4 as uuidv4 } from "uuid";
// import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
// import { Colors } from "../../constants/Colors";
// import { Containers } from "../../constants/Container";
// import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";
// import CancelButton from "../../components/navigation/CancelButton";
// import ButtonSecondary from "../../components/buttons/ButtonSecondary";
// import { Exercise } from "../../interfaces/Exercise.interface";
// import TextOrInput from "../../components/reusables/TextOrInput";
// import { WorkoutService } from "../../services/Workout.service";
// import ExerciseSetsManager from "../../components/reusables/ExerciseSetsManager";

// const formatActivityName = (name: string) => {
//   return name.trim().toUpperCase().replace(/\s+/g, "_");
// };

// const WORKOUTS_KEY = "workouts";

// export default function CreateDayActivityScreen() {
//   const navigation = useNavigation();
//   const router = useRouter();

//   const [activityName, setActivityName] = useState("");

//   const { selectedExercises: selectedExercisesString } = useLocalSearchParams();
//   const [selectedExercises, setSelectedExercises] = useState(() => {
//     let exercisesArray: Exercise[] = [];
//     if (typeof selectedExercisesString === "string") {
//       try {
//         exercisesArray = JSON.parse(selectedExercisesString);
//       } catch (error) {
//         console.error("Failed to parse exercises", error);
//       }
//     } else if (Array.isArray(selectedExercisesString)) {
//       exercisesArray = selectedExercisesString;
//     }

//     return exercisesArray.map((exercise) => ({
//       ...exercise,
//       sets: [{ set: 1, kg: "", reps: "" }],
//     }));
//   });

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => <CancelButton onPress={handleCancelButton} />,
//       headerRight: () => (
//         <RightSecondaryButton title="Save" onPress={handleSave} />
//       ),
//     });
//   }, [navigation, activityName]);

//   // CHECK CANCEL BUTTON TO CLEAN STATES AND NAVIGATE TO WORKOUT-TAB
//   const handleCancelButton = () => {
//     router.push({
//       pathname: "/(tabs)/workout",
//     });
//   };

//   const handleSetChange = (exerciseId: string, setIndex, field, value) => {
//     setSelectedExercises((prevExercises) =>
//       prevExercises.map((exercise) =>
//         exercise.id === exerciseId
//           ? {
//               ...exercise,
//               sets: exercise.sets.map((set, index) =>
//                 index === setIndex ? { ...set, [field]: value } : set
//               ),
//             }
//           : exercise
//       )
//     );
//   };

//   const handleAddSet = (exerciseId: string) => {
//     setSelectedExercises((prevExercises) =>
//       prevExercises.map((exercise) =>
//         exercise.id === exerciseId
//           ? {
//               ...exercise,
//               sets: [
//                 ...exercise.sets,
//                 { set: exercise.sets.length + 1, kg: "", reps: "" },
//               ],
//             }
//           : exercise
//       )
//     );
//   };

//   const handleNavigate = () => {
//     router.push("/(screens)/exerciseListScreen");
//   };

//   const saveWorkout = async (
//     selectedExercises: Exercise[]
//   ) => {
//     const workouts = selectedExercises.map((exercise) => {
//       const setsArray = exercise.sets.map((set) => set.set); // Extract set numbers
//       const repsArray = exercise.sets.map((set) => parseInt(set.reps, 10) || 0); // Extract reps for each set
//       const weightArray = exercise.sets.map(
//         (set) => parseFloat(set.kg, 10) || 0
//       );

//       return {
//         uuid: uuidv4(),
//         date: Date.now().toString(),
//         exerciseId: exercise.id,
//         sets: setsArray,
//         reps: repsArray,
//         weight: weightArray,
//         exerciseNote: "",
//       };
//     });

//     try {
//       const jsonValue = await AsyncStorage.getItem(WORKOUTS_KEY);
//       const existingWorkouts = jsonValue ? JSON.parse(jsonValue) : [];

//       // Combine existing workouts with new workouts
//       const updatedWorkouts = [...existingWorkouts, ...workouts];
//       await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));

//       console.log("Workouts saved successfully!");
//       return true;
//     } catch (error) {
//       console.error("Error saving workouts", error);
//       return false;
//     }
//   };

//   const handleSave = async () => {
//     if (!activityName.trim()) {
//       Alert.alert("Please enter a name for the day activity");
//       return;
//     }
//     try {
//       const newWorkout = await WorkoutService.create();

//     } catch (error) {
//       console.error("Error saving workout & day activity", error);
//       Alert.alert("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <View style={Containers.screenContainer}>
//       <TextOrInput
//         isEditable={true}
//         value={activityName}
//         placeholder="Day Activity Name"
//         onChangeText={(text) => setActivityName(text)}
//       />
//       <View style={styles.separator} />

//       <FlatList
//         data={selectedExercises}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View>
//             <Text style={styles.exerciseName}>{item.name}</Text>

//             <ExerciseSetsManager
//               isEditable={true}
//               exercise={item}
//               onSetChange={handleSetChange}
//               onAddSet={handleAddSet}
//             />
//           </View>
//         )}
//         ListEmptyComponent={
//           <Text style={styles.noExercisesText}>
//             Start adding an Exercise to the Day Activity.
//           </Text>
//         }
//       />

//       <ButtonSecondary title="+ Add Exercise" onPress={handleNavigate} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   inputContainer: {
//     paddingTop: 10,
//   },
//   exerciseName: {
//     color: Colors.text,
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 5,
//   },
//   exerciseText: {
//     color: Colors.text,
//     fontSize: 18,
//     marginBottom: 5,
//   },
//   inputText: {
//     textAlign: "left",
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "white",
//   },
//   separator: {
//     height: 1,
//     backgroundColor: Colors.gray,
//     marginVertical: 10,
//   },
//   noExercisesText: {
//     color: Colors.gray,
//     textAlign: "center",
//     fontSize: 18,
//     marginTop: 20,
//   },
// });
