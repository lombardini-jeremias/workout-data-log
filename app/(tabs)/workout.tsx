import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Containers } from "../../constants/Container";

export default function WorkoutFormScreen() {
  const router = useRoute();
  const navigation = useNavigation();

  const [date, setDate] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseId, setExerciseId] = useState(null);
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    updateDate();

    const selectedActivity = router.params?.selectedActivity;
    if (selectedActivity) {
      setSelectedActivity(selectedActivity);
    }

    const selectedExercise = router.params?.selectedExercise;
    if (selectedExercise) {
      setExerciseId(selectedExercise.id);
      setExerciseName(selectedExercise.name);
    }
  }, [router.params]);

  const updateDate = () => {
    const today = new Date();
    const formattedDate = today.toISOString().replace("T", " ").split(".")[0];
    setDate(formattedDate);
  };

  const saveWorkout = async () => {
    if (!date || !exerciseId || !selectedActivity || !sets || !reps) {
      Alert.alert("Please fill all fields");
      return;
    }
    const workout = {
      id: Date.now().toString(),
      date,
      exerciseId,
      dayActivityId: selectedActivity.id,
      sets,
      reps,
      weight,
      comment,
    };

    try {
      const existingWorkouts = await AsyncStorage.getItem("workout");
      const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];
      workouts.push(workout);
      await AsyncStorage.setItem("workout", JSON.stringify(workouts));
      Alert.alert("Workout saved!");
      console.log("WorkoutSTORAGE:", workouts);

      setExerciseName("");
      setExerciseId(null);
      setSelectedActivity(null);
      setSets(0);
      setReps(0);
      setWeight(0);
      setComment("");

      updateDate();
    } catch (error) {
      console.log(error);
      Alert.alert("Error saving Workout");
    }
  };

  const incrementNumber = (field) => {
    if (field === "sets") {
      setSets((prev) => prev + 1);
    } else if (field === "reps") {
      setReps((prev) => prev + 1);
    } else if (field === "weight") {
      setWeight((prev) => prev + 1);
    }
  };

  const decrementNumber = (field) => {
    if (field === "sets") {
      setSets((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (field === "reps") {
      setReps((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (field === "weight") {
      setWeight((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const selectExercise = () => {
    navigation.navigate("ExerciseListScreen", { fromScreen: "WorkoutForm" });
    // router.push({
    //   pathname: "ExerciseListScreen",
    //   params: { fromScreen: "WorkoutForm" }
    // });
  };

  const selectActivity = () => {
    navigation.navigate("DayActivityListScreen", { fromScreen: "WorkoutForm" });
    // router.push({
    //   pathname: "DayActivityListScreen",
    //   params: { fromScreen: "WorkoutForm" }
    // });
  };

  return (
    <ThemedView style={Containers.screenContainer}>
      <ScrollView>
        <ThemedView>
          <ThemedView style={styles.inputContainer}>
            <ThemedView style={Containers.titleContainer}>
              <ThemedText type="title">Workout Form</ThemedText>
            </ThemedView>
            <ThemedText style={styles.label}>Date:</ThemedText>
            <TextInput
              style={styles.inputText}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD HH:MM:SS"
              editable={false}
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Exercise name:</ThemedText>
            <TouchableOpacity style={styles.inputText} onPress={selectExercise}>
              <ThemedText style={styles.inputTextColor}>
                {exerciseName || "Select Exercise"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Day Activity:</ThemedText>
            <TouchableOpacity style={styles.inputText} onPress={selectActivity}>
              <ThemedText style={styles.inputTextColor}>
                {selectedActivity
                  ? selectedActivity.name
                  : "Select Day Activity"}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Sets:</ThemedText>
            <ThemedView style={styles.inputRow}>
              <TouchableOpacity
                onPress={() => decrementNumber("sets")}
                style={styles.button}
              >
                <ThemedText style={styles.buttonText}>-</ThemedText>
              </TouchableOpacity>
              <TextInput
                style={styles.inputNumber}
                value={String(sets)}
                onChangeText={(text) => setSets(parseInt(text, 10) || 0)}
                placeholder="Number of Sets"
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => incrementNumber("sets")}
                style={styles.button}
              >
                <ThemedText style={styles.buttonText}>+</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Repetitions:</ThemedText>
            <ThemedView style={styles.inputRow}>
              <TouchableOpacity
                onPress={() => decrementNumber("reps")}
                style={styles.button}
              >
                <ThemedText style={styles.buttonText}>-</ThemedText>
              </TouchableOpacity>
              <TextInput
                style={styles.inputNumber}
                value={String(reps)}
                onChangeText={(text) => setReps(parseInt(text, 10) || 0)}
                placeholder="Number of Reps"
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => incrementNumber("reps")}
                style={styles.button}
              >
                <ThemedText style={styles.buttonText}>+</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Weight:</ThemedText>
            <TextInput
              style={styles.inputText}
              value={String(weight)}
              onChangeText={(text) => setWeight(parseInt(text, 10) || 0)}
              placeholder="Weight Used"
              keyboardType="numeric"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Comment:</ThemedText>
            <TextInput
              style={styles.inputText}
              value={comment}
              onChangeText={setComment}
              placeholder="Comment"
              placeholderTextColor={Colors.text}
            />
          </ThemedView>

          <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
            <ThemedText style={styles.saveButtonText}>Save Workout</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputNumber: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.text,
    padding: 20,
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: Colors.dark.background,
    color: Colors.text,
  },
  inputText: {
    borderWidth: 1,
    borderColor: Colors.text,
    padding: 10,
    borderRadius: 5,
    textAlign: "left",
    backgroundColor: Colors.cardBackground,
    color: Colors.text,
  },
  inputTextColor: {
    color: Colors.text,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.dark.button,
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: Colors.dark.button,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
});
