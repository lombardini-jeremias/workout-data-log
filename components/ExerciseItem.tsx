import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import ButtonPrimary from "./buttons/ButtonPrimary";
import { Colors } from "../constants/Colors";

export default function ExerciseItem({ exercise, onSetChange, onAddSet }) {
  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.exerciseText}>Equipment: {exercise.equipment}</Text>

      <View style={styles.tableHeader}>
        <View style={styles.column}>
          <Text style={styles.columnText}>SET</Text>
          {exercise.sets.map((set, index) => (
            <Text style={styles.setNumber} key={index}>
              {set.set}
            </Text>
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnText}>KG</Text>
          {exercise.sets.map((set, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder="-"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
              value={set.kg}
              onChangeText={(value) =>
                onSetChange(exercise.id, index, "kg", value)
              }
            />
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnText}>REPS</Text>
          {exercise.sets.map((set, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder="-"
              placeholderTextColor={Colors.gray}
              keyboardType="numeric"
              value={set.reps}
              onChangeText={(value) =>
                onSetChange(exercise.id, index, "reps", value)
              }
            />
          ))}
        </View>
      </View>

      <ButtonPrimary title="+ Add Set" onPress={() => onAddSet(exercise.id)} />

      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseContainer: {
    marginBottom: 5,
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
  input: {
    color: "white",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
    height: 30,
    marginVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
});
