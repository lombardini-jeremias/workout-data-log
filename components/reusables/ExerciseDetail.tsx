import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function ExerciseDetails({ exercise }) {
  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.exerciseText}>Equipment: {exercise.equipment}</Text>

      <View style={styles.tableHeader}>
        <View style={styles.column}>
          <Text style={styles.columnText}>SET</Text>
          {exercise.sets.map((set, index) => (
            <Text style={styles.setNumber}>{index + 1}</Text>
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnText}>KG</Text>
          {exercise.sets.map((set, index) => (
            <Text style={styles.setNumber}>{exercise.weight[index]}</Text>
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnText}>REPS</Text>
          {exercise.sets.map((set, index) => (
            <Text style={styles.setNumber}>{exercise.reps[index]}</Text>
          ))}
        </View>
      </View>

      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseContainer: {
    marginBottom: 5,
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
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  columnText: {
    color: Colors.gray,
    fontWeight: "bold",
    marginBottom: 5,
  },
  setNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    height: 30,
    lineHeight: 30,
    marginVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 5,
  },
});
