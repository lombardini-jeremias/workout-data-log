import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
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
import TextOrInput from "../../components/reusables/TextOrInput";
import ExerciseItemOrDetails from "../../components/reusables/ExerciseItemOrDetails";
import ExerciseNameSmall from "../../components/reusables/ExerciseNameSmall";
import ExerciseNote from "../../components/reusables/ExerciseNote";

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

  const [isEditable, setIsEditable] = useState(false);

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
      pathname: "/(screens)/exerciseDetailScreen",
      params: { exerciseId },
    });
  };

  const getExerciseNameById = (id: string) => {
    const exercise = exercisesData.exercises.find(
      (exercise) => exercise.id === id
    );
    return exercise ? exercise.name : "Unknown Exercise";
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
        value={activityName}
        placeholder="Day Activity Name"
        onChangeText={(text) => setActivityName(text)}
      />
      <View style={styles.separator} />

      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => (
            <View>
              <ExerciseNameSmall
                exerciseId={item.exerciseId}
                onPress={handleExerciseDetailById}
                getExerciseNameById={getExerciseNameById}
              />

              <ExerciseNote note={item.comment} />

              <ExerciseItemOrDetails
                isEditable={isEditable}
                exercise={item}
                onSetChange={handleSetChange}
                onAddSet={handleAddSet}
              />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noWorkoutsText}>
          No workouts found for this day activity.
        </Text>
      )}
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
    marginTop: 20,
    textAlign: "center",
    color: Colors.gray,
  },
});
