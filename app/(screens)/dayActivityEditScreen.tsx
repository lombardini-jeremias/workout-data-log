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
import { Exercise } from "../../interfaces/Exercise.interfaces";

import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";
import CancelButton from "../../components/navigation/CancelButton";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";

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
    navigation.navigate("dayActivityDetailScreen");
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
      {/* Edit DayActivity Name */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Day Activity Name"
          placeholderTextColor={Colors.gray}
          value={activityName}
          onChangeText={(text) => setActivityName(text)}
        />
      </View>
      <View style={styles.separator} />

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.exerciseName}>
              {availableExercises.find(
                (exercise) => exercise.id === item.exerciseId
              )?.name || "Unknown Exercise"}
            </Text>

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
                    handleSetChange(item.uuid, index, "kg", value)
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Reps"
                  placeholderTextColor={Colors.gray}
                  keyboardType="numeric"
                  value={set.reps}
                  onChangeText={(value) =>
                    handleSetChange(item.uuid, index, "reps", value)
                  }
                />
              </View>
            ))}

            <ButtonPrimary
              title="+ Add Set"
              onPress={() => handleAddSet(item.uuid)}
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

      {/* Add Exercise Section */}
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
  exerciseName: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  columnText: {
    color: Colors.gray,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 5,
  },
  setNumber: {
    color: "white",
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.darkGray,
    color: "white",
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
    marginHorizontal: 5,
  },
  noExercisesText: {
    color: Colors.gray,
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});
