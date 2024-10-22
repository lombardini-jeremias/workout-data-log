import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

import { ExerciseTypeCategory } from "../../interfaces/ExerciseType.interface";

import ButtonPrimary from "../buttons/ButtonPrimary";

interface ExerciseSetsManager2Props {
  exercise: any;
  isEditable: boolean;
  onSetChange: (
    exerciseId: string,
    setIndex: number,
    field: string,
    value: string
  ) => void;
  onAddSet: (exerciseId: string) => void;
  onDeleteSet?: (exerciseId: string, setIndex: number) => void;
  exerciseType?: ExerciseTypeCategory;
}

export default function ExerciseSetsManager2({
  exercise,
  isEditable,
  onSetChange,
  onAddSet,
  exerciseType,
}: ExerciseSetsManager2Props) {
  const renderField = (set, index, field, placeholder, valueKey) => {
    return isEditable ? (
      <TextInput
        key={`${index}-${valueKey}`}
        style={[styles.input]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        keyboardType="numeric"
        value={set[valueKey] ? String(set[valueKey]) : ""}
        onChangeText={(value) => onSetChange(exercise.id, index, field, value)}
      />
    ) : (
      <Text style={styles.setNumber} key={index}>
        {set[valueKey]}
      </Text>
    );
  };

  if (!exerciseType) {
    return <Text>No valid exercise type available.</Text>;
  }

  return ( 
    <View style={styles.setContainer}>
      <View style={styles.tableHeader}>
        <View style={styles.columnSet}>
          <Text style={styles.columnText}>SET</Text>
          {exercise.sets.map((set, index) => (
            <Text style={styles.setNumber} key={index}>
              {index + 1}
            </Text>
          ))}
        </View>

        {/* Conditionally Render Fields Based on Exercise Type */}
        {exerciseType === ExerciseTypeCategory.WEIGHTED_REPS && (
          <>
            <View style={styles.column}>
              <Text style={styles.columnText}>KG</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "weight", "-", "weight")
              )}
            </View>
            <View style={styles.column}>
              <Text style={styles.columnText}>REPS</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "reps", "-", "reps")
              )}
            </View>
          </>
        )}

        {exerciseType === ExerciseTypeCategory.BODYWEIGHT_REPS && (
          <View style={styles.column}>
            <Text style={styles.columnText}>REPS</Text>
            {exercise.sets.map((set, index) =>
              renderField(set, index, "reps", "-", "reps")
            )}
          </View>
        )}

        {exerciseType === ExerciseTypeCategory.BODYWEIGHT_WEIGHTED && (
          <>
            <View style={styles.column}>
              <Text style={styles.columnText}>KG</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "weight", "-", "weight")
              )}
            </View>
            <View style={styles.column}>
              <Text style={styles.columnText}>REPS</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "reps", "-", "reps")
              )}
            </View>
          </>
        )}

        {exerciseType === ExerciseTypeCategory.ASSISTED_BODYWEIGHT && (
          <>
            <View style={styles.column}>
              <Text style={styles.columnText}>Assistance (KG)</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "weight", "-", "weight")
              )}
            </View>
            <View style={styles.column}>
              <Text style={styles.columnText}>REPS</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "reps", "-", "reps")
              )}
            </View>
          </>
        )}

        {exerciseType === ExerciseTypeCategory.DURATION && (
          <View style={styles.column}>
            <Text style={styles.columnText}>DURATION (sec)</Text>
            {exercise.sets.map((set, index) =>
              renderField(set, index, "duration", "-", "duration")
            )}
          </View>
        )}

        {exerciseType === ExerciseTypeCategory.DURATION_WEIGHT && (
          <>
            <View style={styles.column}>
              <Text style={styles.columnText}>KG</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "weight", "-", "weight")
              )}
            </View>
            <View style={styles.column}>
              <Text style={styles.columnText}>DURATION (sec)</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "duration", "-", "duration")
              )}
            </View>
          </>
        )}

        {exerciseType === ExerciseTypeCategory.DISTANCE_DURATION && (
          <>
            <View style={styles.column}>
              <Text style={styles.columnText}>DISTANCE (km)</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "distance", "-", "distance")
              )}
            </View>
            <View style={styles.column}>
              <Text style={styles.columnText}>DURATION (sec)</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "duration", "-", "duration")
              )}
            </View>
          </>
        )}

        {exerciseType === ExerciseTypeCategory.WEIGHT_DISTANCE && (
          <>
            <View style={styles.column}>
              <Text style={styles.columnText}>KG</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "weight", "-", "weight")
              )}
            </View>
            <View style={styles.column}>
              <Text style={styles.columnText}>DISTANCE (km)</Text>
              {exercise.sets.map((set, index) =>
                renderField(set, index, "distance", "-", "distance")
              )}
            </View>
          </>
        )}
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
  setContainer: {
    marginBottom: 5,
  },
  inputFocused: {
    borderColor: Colors.gray,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnSet: {
    flex: 0.5,
    alignItems: "center",
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
    color: Colors.text,
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 35,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    fontSize: 16,
    color: "white",
    borderRadius: 5,
    padding: 5,
    width: "80%",
    marginBottom: 5,
    textAlign: "center",
    height: 35,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
});
