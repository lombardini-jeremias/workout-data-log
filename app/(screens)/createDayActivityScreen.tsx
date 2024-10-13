import { Text, View, Alert, StyleSheet, FlatList } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Containers } from "../../constants/Container";
import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";
import CancelButton from "../../components/navigation/CancelButton";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";
import { Exercise } from "../../interfaces/Exercise.interface";
import TextOrInput from "../../components/reusables/TextOrInput";
import ExerciseItemOrDetails from "../../components/reusables/ExerciseItemOrDetails";
import { WorkoutService } from "../../services/Workout.service";

const formatActivityName = (name: string) => {
  return name.trim().toUpperCase().replace(/\s+/g, "_");
};

const DAY_ACTIVITIES_KEY = "dayActivities";
const WORKOUTS_KEY = "workouts";

export default function CreateDayActivityScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [activityName, setActivityName] = useState("");

  const { selectedExercises: selectedExercisesString } = useLocalSearchParams();
  const [selectedExercises, setSelectedExercises] = useState(() => {
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

  // CHECK CANCEL BUTTON TO CLEAN STATES AND NAVIGATE TO WORKOUT-TAB
  const handleCancelButton = () => {
    router.push({
      pathname: "/(tabs)/workout",
    });
  };

  const handleSetChange = (exerciseId: string, setIndex, field, value) => {
    setSelectedExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, index) =>
                index === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : exercise
      )
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
    router.push("/(screens)/exerciseListScreen");
  };

  // const saveDayActivity = async (name: string) => {
  //   const formattedName = formatActivityName(name);
  //   const newDayActivity = { uuid: uuid(), name: formattedName };
  //   try {
  //     const jsonValue = await AsyncStorage.getItem(DAY_ACTIVITIES_KEY);
  //     const dayActivities = jsonValue ? JSON.parse(jsonValue) : [];
  //     const activityExists = dayActivities.some(
  //       (activity: any) => activity.name === formattedName
  //     );
  //     if (activityExists) {
  //       Alert.alert("Activity with this name already exists.");
  //       return false;
  //     }

  //     const updatedDayActivities = [...dayActivities, newDayActivity];
  //     await AsyncStorage.setItem(
  //       DAY_ACTIVITIES_KEY,
  //       JSON.stringify(updatedDayActivities)
  //     );
  //     console.log("DayActivity saved successfully!");
  //     setActivityName("");
  //     return newDayActivity;
  //   } catch (error) {
  //     console.error("Error saving day activity", error);
  //     return false;
  //   }
  // };

  const saveWorkout = async (
    selectedExercises: Exercise[]
  ) => {
    const workouts = selectedExercises.map((exercise) => {
      const setsArray = exercise.sets.map((set) => set.set); // Extract set numbers
      const repsArray = exercise.sets.map((set) => parseInt(set.reps, 10) || 0); // Extract reps for each set
      const weightArray = exercise.sets.map(
        (set) => parseFloat(set.kg, 10) || 0
      );

      return {
        uuid: uuidv4(),
        title: title,
        date: Date.now().toString(),
        exerciseId: exercise.id,
        sets: setsArray,
        reps: repsArray,
        weight: weightArray,
        exerciseNote: "",
      };
    });

    try {
      const jsonValue = await AsyncStorage.getItem(WORKOUTS_KEY);
      const existingWorkouts = jsonValue ? JSON.parse(jsonValue) : [];

      // Combine existing workouts with new workouts
      const updatedWorkouts = [...existingWorkouts, ...workouts];
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));

      console.log("Workouts saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving workouts", error);
      return false;
    }
  };

  const handleSave = async () => {
    if (!activityName.trim()) {
      Alert.alert("Please enter a name for the day activity");
      return;
    }
    try {
      const newWorkout = await WorkoutService.create();


    } catch (error) {
      console.error("Error saving workout & day activity", error);
      Alert.alert("An error occurred. Please try again.");
    }
  };

  // const handleExerciseDetailById = (exerciseId: string) => {
  //   router.push({
  //     pathname: "/(screens)/exerciseDetailScreen",
  //     params: { exerciseId },
  //   });
  // };

  // const getExerciseNameById = (uuid: string) => {
  //   const exercise = exercisesData.exercises.find(
  //     (exercise) => exercise.id === uuid
  //   );
  //   return exercise ? exercise.name : "Unknown Exercise";
  // };

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

            <ExerciseItemOrDetails
              isEditable={true}
              exercise={item}
              onSetChange={handleSetChange}
              onAddSet={handleAddSet}
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


      // const savedDayActivity = await saveDayActivity(activityName);
      // if (savedDayActivity && savedDayActivity.uuid) {
      //   console.log(
      //     "Activity saved. Proceeding to save workouts...",
      //     savedDayActivity
      //   );

      //   const successWorkoutsSave = await saveWorkout(
      //     savedDayActivity.uuid,
      //     selectedExercises
      //   );
      //   if (successWorkoutsSave) {
      //     Alert.alert("Workouts and Day Activity saved successfully!");
      //     router.push("workout");
      //   } else {
      //     Alert.alert("Error saving workouts. Please try again.");
      //   }
      // } else {
      //   Alert.alert("Error saving day activity. Please try again.");
      // }