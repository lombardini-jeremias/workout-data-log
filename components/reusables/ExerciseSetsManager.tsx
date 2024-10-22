import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

import { ExerciseTypeCategory } from "../../interfaces/ExerciseType.interface";

import ButtonPrimary from "../buttons/ButtonPrimary";

interface ExerciseSetsManagerProps {
  exercise: any;
  isEditable: boolean;
  onSetChange: (
    exerciseId: string,
    setIndex: number,
    field: string,
    value: number
  ) => void;
  onAddSet: (exerciseId: string) => void;
  exerciseType?: ExerciseTypeCategory;
}

export default function ExerciseSetsManager({
  exercise,
  isEditable,
  onSetChange,
  onAddSet,
  exerciseType,
}: ExerciseSetsManagerProps) {
  const [focusStates, setFocusStates] = useState(
    exercise.sets.map(() => false)
  );
  const [tempValues, setTempValues] = useState(
    exercise.sets.map((set) => ({
      weight: set.weight !== undefined ? String(set.weight) : "",
      reps: set.reps !== undefined ? String(set.reps) : "",
      duration: set.duration !== undefined ? String(set.duration) : "",
      distance: set.distance !== undefined ? String(set.distance) : "",
    }))
  );

  useEffect(() => {
    setTempValues(
      exercise.sets.map((set, index) => ({
        weight: set.weight !== undefined ? String(set.weight) : "",
        reps: set.reps !== undefined ? String(set.reps) : "",
        duration: set.duration !== undefined ? String(set.duration) : "",
        distance: set.distance !== undefined ? String(set.distance) : "",
      }))
    );
    setFocusStates(exercise.sets.map(() => false)); // Reset focus states if necessary
  }, [exercise.sets]);

  const handleFocus = (index, valueKey) => {
    setFocusStates((prev) =>
      prev.map((isFocused, i) => (i === index ? true : isFocused))
    );
  };

  const handleBlur = (index, set, valueKey) => {
    setFocusStates((prev) =>
      prev.map((isFocused, i) => (i === index ? false : isFocused))
    );

    const newValue = tempValues[index]?.[valueKey];
    if (newValue !== undefined) {
      // Only trigger set change for the exact field that was blurred
      onSetChange(exercise.id, set.setIndex, valueKey, Number(newValue));
    }
  };

  const handleChangeText = (index, valueKey, text) => {
    setTempValues((prev) =>
      prev.map((tempValue, i) =>
        i === index ? { ...tempValue, [valueKey]: text } : tempValue
      )
    );
  };

  const renderField = useCallback(
    (set, index, field, placeholder, valueKey) => {
      const displayValue =
        set[valueKey] !== undefined && set[valueKey] !== ""
          ? set[valueKey]
          : "-";

      return isEditable ? (
        <TextInput
          key={`${index}-${valueKey}`}
          style={[
            styles.input,
            focusStates[index] ? styles.inputFocused : null,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray}
          keyboardType="numeric"
          value={tempValues[index]?.[valueKey] ?? ""}
          onChangeText={(text) => handleChangeText(index, valueKey, text)}
          onFocus={() => handleFocus(index, valueKey)}
          onBlur={() => handleBlur(index, set, valueKey)}
        />
      ) : (
        <Text style={styles.setNumber} key={index}>
          {displayValue}
        </Text>
      );
    },
    [focusStates, tempValues, isEditable, onSetChange]
  );

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
