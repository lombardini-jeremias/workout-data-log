import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Workout } from "../../interfaces/Workout.interfaces"; // Assuming you have this interface defined
import { Colors } from "../../constants/Colors";
import { Containers } from "../../constants/Container";
import exercisesData from "../../db/exercises.json";
import BackButton from "../../components/navigation/BackButton";

const WORKOUTS_KEY = "workouts";

export default function DayActivityDetailScreen() {
  const navigation = useNavigation();
  const { selectedDayActivityId } = useLocalSearchParams();
  const { selectedDayActivityName } = useLocalSearchParams();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const storedWorkouts = await AsyncStorage.getItem(WORKOUTS_KEY);
        const parsedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];

        // Filter the workouts to only show those related to the selected dayActivity
        const filteredWorkouts = parsedWorkouts.filter(
          (workout: Workout) => workout.dayActivityId === selectedDayActivityId
        );

        setWorkouts(filteredWorkouts);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        Alert.alert("Failed to fetch workouts.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedDayActivityId) {
      fetchWorkouts();
    }
  }, [selectedDayActivityId]);

  if (loading) {
    return (
      <View style={Containers.screenContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getExerciseNameById = (id: string) => {
    const exercise = exercisesData.exercises.find(
      (exercise) => exercise.id === id
    );
    return exercise ? exercise.name : "Unknown Exercise";
  };

  const handleExerciseDetailById = (exerciseId: string) => {
    navigation.navigate("exerciseDetailScreen", { exerciseId });
    console.log("exerciseID", exerciseId);
  };

  const handleEditDayActivity = (selectedDayActivityId: string) => {
    navigation.navigate("dayActivityEditScreen", { selectedDayActivityId });
    console.log("dayActivityId", selectedDayActivityId);
  };

  return (
    <View style={Containers.screenContainer}>
      <Text style={styles.headerText}>{selectedDayActivityName}</Text>

      <View style={styles.subheaderContainer}>
        <Text style={styles.subheaderText}>Exercises</Text>
        <TouchableOpacity onPress={handleEditDayActivity}>
          <Text style={styles.subheaderButton}>Edit Day Activity</Text>
        </TouchableOpacity>
      </View>

      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.workoutContainer}>
              <TouchableOpacity
                onPress={() => handleExerciseDetailById(item.exerciseId)}
              >
                <Text style={styles.exerciseText}>
                  {getExerciseNameById(item.exerciseId)}
                </Text>
              </TouchableOpacity>

              {item.comment && (
                <Text style={styles.commentText}>Comment: {item.comment}</Text>
              )}

              <View style={styles.tableHeader}>
                <Text style={styles.tableText}>SET</Text>
                <Text style={styles.tableText}>KG</Text>
                <Text style={styles.tableText}>REPS</Text>
              </View>

              {item.sets.map((set, index) => (
                <View style={styles.tableHeader}>
                  <Text style={styles.setText}>{index + 1}</Text>
                  <Text style={styles.setText}>{item.weight[index]}</Text>
                  <Text style={styles.setText}>{item.reps[index]}</Text>
                </View>
              ))}

              <View style={styles.separator} />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noWorkoutsText}>
          No workouts found for this day activity.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginVertical: 5,
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
  workoutContainer: {
    backgroundColor: Colors.primary,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  tableHeader: {
    flexDirection: "row",
    marginVertical: 5,
  },
  tableText: {
    color: Colors.gray,
    fontWeight: "bold",
    flex: 1,
  },
  setText: {
    color: Colors.text,
    fontWeight: "bold",
    flex: 1,
    marginStart: 10,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginTop: 16,
  },
  noWorkoutsText: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.gray,
  },
});
