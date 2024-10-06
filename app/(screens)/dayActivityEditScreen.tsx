import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

import { Colors } from "../../constants/Colors";
import { Containers } from "../../constants/Container";
import { Exercise } from "../../interfaces/Exercise.interfaces";

import RightSecondaryButton from "../../components/navigation/RightSecondaryButton";
import CancelButton from "../../components/navigation/CancelButton";
import ButtonPrimary from "../../components/buttons/ButtonPrimary";

export default function dayActivityEditScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { selectedDayActivityId } = useLocalSearchParams();
  console.log("DayActivityId_ON_EDIT_SCREEN", selectedDayActivityId);

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
        <RightSecondaryButton title="Update" onPress={handleUpdate} />
      ),
    });
  }, [navigation]);

  const handleCancelButton = () => {
    navigation.navigate("dayActivityDetailScreen");
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

  const saveDayActivity = async (name: string) => {};

  const saveWorkout = async () => {};

  const handleUpdate = async () => {};

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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {},
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
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  exerciseText: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
  },
  noExercisesText: {
    color: Colors.gray,
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  exerciseContainer: {
    marginBottom: 20,
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
});
