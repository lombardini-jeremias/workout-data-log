## TO DO:

1. createExerciseScreen setup Save function:

   1. Setup selection of Equipment
   2. Setup selection of Force
   3. Setup selection of mechanic
   4. Setup selection of Level
   5. Setup selection of Muscles
   6. Setup selection of Category

2. exerciseListScreen setup:

   1. setup Styles. **_DONE_**
   2. setup function onSelect more >1 exercise **_DONE_**
   3. Create button "Add Exercise" **_DONE_**
      (function: add selected Exercises to createDayActivityScreen Flatlist )

3. createDayActivityScreen setup:
   1. Setup configuration of saving right. **_DONE_**
   2. Setup dayActivity Entity. ("uuid", "name"). **_DONE_**
   3. Setup workout Entity. (
      id: Date.now().toString(),
      date: formattedDate,
      exerciseId: exercise.id,
      dayActivityId: dayActivity.uuid,
      sets: setsArray,
      reps: repsArray,
      weight: weightArray,
      comment: "",) **_DONE_**
   4. Fix Alert popups when dayActivity saved and workout Saved
      (only one pop up "workout saved!") **_DONE_**
   5. Keep data saved on screen when navigating to exerciseListScreen and coming back.
      (useContext)
4. workoutTab:
   1. Setup Flatlist to visualize all Day Activities saved under "New Activity" button. **_DONE_**
5. exerciseListScreen on Styles need to config Colors constants so when we use Colors.text its one for all, for light or dark theme.

6. dayActivityDetailScreen

   1. Add EditButton that navigates to Edit setup.
   2. Edit setup should be same Screen as createDayActivityScreen.
      ( change Tab SaveButton to UpadteButton )
      ( Add Tab CancelButton and when onPress() an Alert: "discard Changes?" / "cancel" )

7. editDayActivityScreen:
   1. Add ellipsis-vertical to "workoutContainer" && navigation to Options-popUp.
   2. Add SuperSet info on the "workoutContainer".
   3. Create component Options-popUp
   4. On Options-popUp Add function: Reorder Exercises, Replace Exercise, create SuperSet / Remove from SuperSet, Remove Exercise.
   5.

Reorder Tabs screen and Stack Screen : "https://www.youtube.com/watch?v=4-shpLyYBLc"
Add "ellipsis-horizontal-sharp" on workoutTab on each dayActivity as touchable options












CONTEXT QUESTION TODO:
GPT im coding a useContext function to get access to the data from any component where i use this provider data.
let me show you what i had coded:
DayActivityProvider.jsx
""
import React, { createContext, useState, useContext } from "react";

interface DayActivityContextProps {
  activityName: string;
  setActivityName: (name: string) => void;
}

const DayActivityContext = createContext<DayActivityContextProps | undefined>(
  undefined
);

export function useDayActivity() {
  const context = useContext(DayActivityContext);
  if (!context) {
    throw new Error("useDayActivity must be used within a DayActivityProvider");
  }
  return context;
}

export function DayActivityProvider({ children }) {
  const [activityName, setActivityName] = useState<string>("");

  return (
    <DayActivityContext.Provider
      value={{
        activityName,
        setActivityName,
      }}
    >
      {children}
    </DayActivityContext.Provider>
  );
}
""
now i wanna use this to pass the state info to other components. Here i will show you where im creating DayActivity entity:
createDayActivityScreen.jsx
""
import {
  Text,
  View,
  TextInput,
  Alert,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Containers } from "../../constants/Container";
import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";
import CancelButton from "../../components/navigation/CancelButton";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";
import { Exercise } from "../../interfaces/Exercise.interfaces";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";

const formatActivityName = (name: string) => {
  return name.trim().toUpperCase().replace(/\s+/g, "_");
};

const DAY_ACTIVITIES_KEY = "dayActivities";
const WORKOUTS_KEY = "workouts";

export default function CreateDayActivity() {
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

  const handleCancelButton = () => {
    navigation.navigate("workout");
  };

  const handleSetChange = (exerciseId, setIndex, field, value) => {
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

  const handleAddSet = (exerciseId) => {
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
    router.push("exerciseListScreen");
  };

  const saveDayActivity = async (name: string) => {
    const formattedName = formatActivityName(name);
    const newDayActivity = { uuid: uuid(), name: formattedName };
    try {
      const jsonValue = await AsyncStorage.getItem(DAY_ACTIVITIES_KEY);
      const dayActivities = jsonValue ? JSON.parse(jsonValue) : [];
      const activityExists = dayActivities.some(
        (activity) => activity.name === formattedName
      );
      if (activityExists) {
        Alert.alert("Activity with this name already exists.");
        return false;
      }

      const updatedDayActivities = [...dayActivities, newDayActivity];
      await AsyncStorage.setItem(
        DAY_ACTIVITIES_KEY,
        JSON.stringify(updatedDayActivities)
      );
      console.log("DayActivity saved successfully!");
      setActivityName("");
      return newDayActivity;
    } catch (error) {
      console.error("Error saving day activity", error);
      return false;
    }
  };

  const saveWorkout = async (
    dayActivityId: string,
    selectedExercises: Exercise[]
  ) => {
    const workouts = selectedExercises.map((exercise) => {
      const setsArray = exercise.sets.map((set) => set.set); // Extract set numbers
      const repsArray = exercise.sets.map((set) => parseInt(set.reps, 10) || 0); // Extract reps for each set
      const weightArray = exercise.sets.map(
        (set) => parseFloat(set.kg, 10) || 0
      );

      return {
        uuid: uuid(),
        date: Date.now().toString(),
        exerciseId: exercise.id,
        dayActivityId: dayActivityId,
        sets: setsArray,
        reps: repsArray,
        weight: weightArray,
        comment: "",
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
      const savedDayActivity = await saveDayActivity(activityName);
      if (savedDayActivity && savedDayActivity.uuid) {
        console.log(
          "Activity saved. Proceeding to save workouts...",
          savedDayActivity
        );

        const successWorkoutsSave = await saveWorkout(
          savedDayActivity.uuid,
          selectedExercises
        );
        if (successWorkoutsSave) {
          Alert.alert("Workouts and Day Activity saved successfully!");
          router.push("workout");
        } else {
          Alert.alert("Error saving workouts. Please try again.");
        }
      } else {
        Alert.alert("Error saving day activity. Please try again.");
      }
    } catch (error) {
      console.error("Error saving workout & day activity", error);
      Alert.alert("An error occurred. Please try again.");
    }
  };

  return (
    <View style={Containers.screenContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Day Activity Name"
          placeholderTextColor={Colors.gray}
          value={activityName}
          onChangeText={(text) => {
            setActivityName(text);
          }}
        />
      </View>
      <View style={styles.separator} />

      <FlatList
        data={selectedExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseText}>Equipment: {item.equipment}</Text>

            <View style={styles.tableHeader}>
              <Text style={styles.columnText}>SET</Text>
              <Text style={styles.columnText}>KG</Text>
              <Text style={styles.columnText}>REPS</Text>
            </View>

            {item.sets.map((set, index) => (
              <View style={styles.inputRow} key={index}>
                <Text style={styles.setNumber}>{set.set}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="KG"
                  placeholderTextColor={Colors.gray}
                  keyboardType="numeric"
                  value={set.kg}
                  onChangeText={(value) =>
                    handleSetChange(item.id, index, "kg", value)
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Reps"
                  placeholderTextColor={Colors.gray}
                  keyboardType="numeric"
                  value={set.reps}
                  onChangeText={(value) =>
                    handleSetChange(item.id, index, "reps", value)
                  }
                />
              </View>
            ))}

            <ButtonPrimary
              title="+ Add Set"
              onPress={() => handleAddSet(item.id)}
            />

            <View style={styles.separator} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noExercisesText}>
            Start adding an Exercise to the Day Activity.
          </Text>
        }
      />

      <ButtonSecondary title="Add Exercise" onPress={handleNavigate} />
    </View>
  );
}
""
