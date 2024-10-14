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
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Containers } from "../../constants/Container";
import exercisesData from "../../db/exercises.json";
import BackButton from "../../components/navigation/BackButton";
import TextOrInput from "../../components/reusables/TextOrInput";
import ExerciseItemOrDetails from "../../components/reusables/ExerciseItemOrDetails";

const WORKOUTS_KEY = "workouts";

export default function workoutPlanDetailScreen() {
  const navigation = useNavigation();
  const router = useRouter();

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

  const getExerciseNameById = (id: string) => {
    const exercise = exercisesData.exercises.find(
      (exercise) => exercise.id === id
    );
    return exercise ? exercise.name : "Unknown Exercise";
  };

  const handleExerciseDetailById = (exerciseId: string) => {
    router.push({
      pathname: "/(screens)/personalExerciseDetailScreen",
      params: { exerciseId },
    });
  };

  const handleEditDayActivity = (selectedDayActivityId: string) => {
    if (!selectedDayActivityId) {
      console.error("No Day Activity ID provided.");
      return;
    }
    router.push({
      pathname: "/(screens)/workoutPlanEditScreen",
      params: { selectedDayActivityId },
    });
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
      <TextOrInput isEditable={false} value={selectedDayActivityName} />

      <View style={styles.subheaderContainer}>
        <Text style={styles.subheaderText}>Exercises</Text>
        <TouchableOpacity
          onPress={() => handleEditDayActivity(selectedDayActivityId)}
        >
          <Text style={styles.subheaderButton}>Edit Day Activity</Text>
        </TouchableOpacity>
      </View>

      {workouts.length > 0 ? (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => (
            <View>
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

              <ExerciseItemOrDetails isEditable={false} exercise={item} />
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
  noWorkoutsText: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.gray,
  },
});
