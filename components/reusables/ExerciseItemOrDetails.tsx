import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { Colors } from "@/constants/Colors";

interface ExerciseItemOrDetailsProps {
  exercise: any;
  isEditable: boolean;
  onSetChange?: (
    exerciseId: string,
    setIndex: number,
    field: string,
    value: string
  ) => void;
  onAddSet?: (exerciseId: string) => void;
}

export default function ExerciseItemOrDetails({
  exercise,
  isEditable,
  onSetChange = () => {},
  onAddSet = () => {},
}: ExerciseItemOrDetailsProps) {
  return (
    <View style={styles.exerciseContainer}>
      {/* <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.exerciseText}>Equipment: {exercise.equipment}</Text> */}

      <View style={styles.tableHeader}>
        <View style={styles.column}>
          <Text style={styles.columnText}>SET</Text>
          {exercise.sets.map((set, index) =>
            isEditable ? (
              <Text style={styles.setNumber} key={index}>
                {index + 1}
              </Text>
            ) : (
              <Text style={styles.setNumber} key={index}>
                {exercise.sets[index]}
              </Text>
            )
          )}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnText}>KG</Text>
          {exercise.sets.map((set, index) =>
            isEditable ? (
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
            ) : (
              <Text style={styles.setNumber} key={index}>
                {exercise.weight[index]}
              </Text>
            )
          )}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnText}>REPS</Text>
          {exercise.sets.map((set, index) =>
            isEditable ? (
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
            ) : (
              <Text style={styles.setNumber} key={index}>
                {exercise.reps[index]}
              </Text>
            )
          )}
        </View>
      </View>

      {isEditable && (
        <ButtonPrimary
          title="+ Add Set"
          onPress={() => onAddSet(exercise.id)}
        />
      )}

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
  input: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    height: 30,
    lineHeight: 30,
    marginVertical: 5,
    borderBottomWidth: 1,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 5,
  },
});
