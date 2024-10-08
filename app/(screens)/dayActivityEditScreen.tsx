import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import exercisesData from "../../db/exercises.json";

import { Colors } from "../../constants/Colors";
import { Containers } from "../../constants/Container";

import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";
import CancelButton from "../../components/navigation/CancelButton";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";
import ExerciseItem from "../../components/reusables/ExerciseItem";
import TextOrInput from "../../components/reusables/TextOrInput";

const WORKOUTS_KEY = "workouts";
const DAY_ACTIVITIES_KEY = "dayActivities";

export default function dayActivityEditScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const { selectedDayActivityId } = useLocalSearchParams<{
    selectedDayActivityId: string;
  }>();

  const [activityName, setActivityName] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelButton onPress={handleCancelButton} />,
      headerRight: () => (
        <RightSecondaryButton title="Update" onPress={handleUpdate} />
      ),
    });
  }, [navigation, workouts, activityName]);

  const handleCancelButton = () => {
    router.back();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedWorkouts = await AsyncStorage.getItem(WORKOUTS_KEY);
        const storedDayActivities = await AsyncStorage.getItem(
          DAY_ACTIVITIES_KEY
        );

        const parsedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
        const parsedDayActivities = storedDayActivities
          ? JSON.parse(storedDayActivities)
          : [];

        // Get the current day activity's name
        const currentActivity = parsedDayActivities.find(
          (activity) => activity.uuid === selectedDayActivityId
        );
        if (currentActivity) {
          setActivityName(currentActivity.name);
        }

        // Filter workouts related to this day activity
        const filteredWorkouts = parsedWorkouts.filter(
          (workout) => workout.dayActivityId === selectedDayActivityId
        );
        setWorkouts(filteredWorkouts);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedDayActivityId) {
      fetchData();
    }
  }, [selectedDayActivityId]);

  const handleSetChange = (exerciseId, setIndex, field, value) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.exerciseId === exerciseId
          ? {
              ...workout,
              sets: workout.sets.map((set, index) =>
                index === setIndex ? { ...set, [field]: value } : set
              ),
            }
          : workout
      )
    );
  };

  const handleAddSet = (exerciseId) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.exerciseId === exerciseId
          ? {
              ...workout,
              sets: [
                ...workout.sets,
                { set: workout.sets.length + 1, kg: "", reps: "" },
              ],
            }
          : workout
      )
    );
  };

  const handleAddExercise = () => {
    router.push("/(screens)/exerciseListScreen");
  };

  const handleUpdate = async () => {
    try {
      // Save updated workouts
      const storedWorkouts = await AsyncStorage.getItem(WORKOUTS_KEY);
      const parsedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];

      // Update the workouts list with the modified ones
      const updatedWorkouts = parsedWorkouts.map(
        (workout) => workouts.find((w) => w.uuid === workout.uuid) || workout
      );

      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));

      // Save updated day activity name
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
      navigation.goBack();
    } catch (error) {
      console.error("Error updating data:", error);
      Alert.alert("Failed to update data.");
    }
  };

  const handleExerciseDetailById = (exerciseId: string) => {
    router.push({
      pathname: "/(screens)/exerciseDetailScreen",
      params: { exerciseId },
    });
  };

  const availableExercises = exercisesData.exercises;

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
        value={activityName}
        placeholder="Day Activity Name"
        onChangeText={(text) => setActivityName(text)}
      />
      <View style={styles.separator} />

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => {
          const exercise = availableExercises.find(
            (exercise) => exercise.id === item.exerciseId
          );
          const exerciseName = exercise ? exercise.name : "Unknown Exercise";

          return (
            <ExerciseItem
              exercise={{
                ...exercise,
                name: exerciseName,
                sets: item.sets,
                equipment: exercise?.equipment || "No Equipment",
              }}
              onSetChange={handleSetChange}
              onAddSet={handleAddSet}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.noExercisesText}>
            Start adding an Exercise to the Day Activity.
          </Text>
        }
      />

      <ButtonSecondary title="Add Exercise" onPress={handleAddExercise} />
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
