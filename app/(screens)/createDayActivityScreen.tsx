import { Text, View, Alert, StyleSheet, FlatList } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Containers } from "../../constants/Container";
import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";
import CancelButton from "../../components/navigation/CancelButton";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";
import { Exercise } from "../../interfaces/Exercise.interface";
import TextOrInput from "../../components/reusables/TextOrInput";
import { WorkoutService } from "../../services/Workout.service";
import { SetService } from "../../services/Set.service";
import ExerciseSetsManager from "../../components/reusables/ExerciseSetsManager";
import { ExerciseTypeCategory } from "../../interfaces/ExerciseType.interface";

export default function CreateDayActivityScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [activityName, setActivityName] = useState("");

  const { selectedExercises: selectedExercisesString } = useLocalSearchParams();
  const [selectedExercises, setSelectedExercises] = useState(() => {
    console.log("selectedExercises", selectedExercisesString);
    let exercisesArray: Exercise[] = [];
    if (typeof selectedExercisesString === "string") {
      try {
        exercisesArray = JSON.parse(selectedExercisesString);
      } catch (error) {
        console.error("Failed to parse exercises", error);
      }
    } else if (Array.isArray(selectedExercisesString)) {
      exercisesArray = selectedExercisesString;
    }

    return exercisesArray.map((exercise) => ({
      ...exercise,
      sets: [{ set: 1, kg: "", reps: "" }],
    }));
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelButton onPress={handleCancelButton} />,
      headerRight: () => (
        <RightSecondaryButton title="Save" onPress={handleSave} />
      ),
    });
  }, [navigation, activityName]);

  const handleCancelButton = () => {
    router.push({
      pathname: "/(tabs)/workout",
    });
  };

  // const handleSetChange = (exerciseId: string, setIndex, field, value) => {
  //   setSelectedExercises((prevExercises) =>
  //     prevExercises.map((exercise) =>
  //       exercise.id === exerciseId
  //         ? {
  //             ...exercise,
  //             sets: exercise.sets.map((set, index) =>
  //               index === setIndex ? { ...set, [field]: value } : set
  //             ),
  //           }
  //         : exercise
  //     )
  //   );
  // };

  const onSetChange = (
    exerciseId: string,
    setIndex: number,
    field: string,
    value: string
  ) => {
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

  const onAddSet = (exerciseId: string) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          let newSet;

          // Create a new set depending on the exercise type
          switch (exercise.exerciseTypeId) {
            case ExerciseTypeCategory.WEIGHTED_REPS:
            case ExerciseTypeCategory.BODYWEIGHT_WEIGHTED:
              newSet = { kg: "", reps: "" };
              break;
            case ExerciseTypeCategory.BODYWEIGHT_REPS:
              newSet = { reps: "" };
              break;
            case ExerciseTypeCategory.ASSISTED_BODYWEIGHT:
              newSet = { kg: "", reps: "" }; // kg for assistance
              break;
            case ExerciseTypeCategory.DURATION:
              newSet = { duration: "" };
              break;
            case ExerciseTypeCategory.DURATION_WEIGHT:
              newSet = { kg: "", duration: "" };
              break;
            case ExerciseTypeCategory.DISTANCE_DURATION:
              newSet = { distance: "", duration: "" };
              break;
            case ExerciseTypeCategory.WEIGHT_DISTANCE:
              newSet = { kg: "", distance: "" };
              break;
            default:
              newSet = {};
          }

          return { ...exercise, sets: [...exercise.sets, newSet] };
        }
        return exercise;
      })
    );
  };

  const handleAddSet = (exerciseId: string) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                { set: exercise.sets.length + 1, kg: "", reps: "" },
              ],
            }
          : exercise
      )
    );
  };

  const handleNavigate = () => {
    router.push("/(screens)/personalExerciseListScreen");
  };

  const handleSave = async () => {
    if (!activityName.trim()) {
      Alert.alert("Please enter a name for the day activity");
      return;
    }

    try {
      // Step 1: Create the workout using WorkoutService
      const workoutData = {
        name: activityName,
        exercises: Exerc,
      };
      const newWorkout = await WorkoutService.create(workoutData);

      // Step 2: Loop through each selected exercise and create related sets and workout-exercise records
      for (const exercise of selectedExercises) {
        // Create a WorkoutExercise entry for each exercise
        const workoutExerciseData = {
          workoutId: newWorkout.id,
          exerciseId: exercise.id,
        };
        const workoutExercise = await WorkoutExerciseService.create(
          workoutExerciseData
        );

        // Create sets for each exercise
        for (const set of exercise.sets) {
          const setData = {
            workoutExerciseId: workoutExercise.id,
            setNumber: set.set,
            weight: parseFloat(set.kg),
            reps: parseInt(set.reps, 10),
          };
          await SetService.create(setData);
        }
      }

      // Display success message
      Alert.alert("Workout saved successfully!");
      router.push({
        pathname: "/(tabs)/workout",
      });
    } catch (error) {
      console.error("Error saving workout & day activity", error);
      Alert.alert("An error occurred. Please try again.");
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

      {/* <FlatList
        data={selectedExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.exerciseName}>{item.name}</Text>

            <ExerciseSetsManager
              isEditable={true}
              exercise={item}
              onSetChange={handleSetChange}
              onAddSet={handleAddSet}
            />
          </View>
        )} */}
      <FlatList
        data={selectedExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.exerciseName}>{item.name}</Text>

            <ExerciseSetsManager
              isEditable={true}
              exercise={item}
              exerciseType={item.exerciseTypeId}
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

      <ButtonSecondary title="+ Add Exercise" onPress={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 10,
  },
  exerciseName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  exerciseText: {
    color: Colors.text,
    fontSize: 18,
    marginBottom: 5,
  },
  inputText: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
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
