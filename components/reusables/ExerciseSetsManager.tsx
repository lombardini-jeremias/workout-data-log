import React, { useState } from "react";
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
    value: string
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
  const renderField = (set, index, field, placeholder, valueKey) => {
    const [isFocused, setIsFocused] = useState(false);
    const [tempValue, setTempValue] = useState(
      set[valueKey] ? String(set[valueKey]) : ""
    ); // Temporary input state

    const handleFocus = () => {
      setIsFocused(true);
      setTempValue(set[valueKey] ? String(set[valueKey]) : ""); // Set the temporary value to the current stored value when focused
    };

    const handleBlur = () => {
      setIsFocused(false);
      onSetChange(exercise.id, index, field, tempValue); // Only update the main state when focus is lost
    };

    return isEditable ? (
      <TextInput
        key={index}
        style={[
          styles.input,
          isFocused ? styles.inputFocused : null, // Apply focused styles if the field is focused
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        keyboardType="numeric"
        value={tempValue} // Bind the value to the temporary state
        onChangeText={setTempValue} // Update temporary state as the user types
        onFocus={handleFocus} // Set focus state and initialize the temp value
        onBlur={handleBlur} // On blur, save the final value to the main state
      />
    ) : (
      <Text style={styles.setNumber} key={index}>
        {set[valueKey]}
      </Text>
    );
  };

  // const renderField = (set, index, field, placeholder, valueKey) => {
  //   const [isFocused, setIsFocused] = useState(false);

  //   return isEditable ? (
  //     <TextInput
  //       key={index}
  //       style={[
  //         styles.input,
  //         isFocused ? styles.inputFocused : null, // Apply focused styles if field is focused
  //       ]}
  //       placeholder={placeholder}
  //       placeholderTextColor={Colors.gray}
  //       keyboardType="numeric"
  //       value={set[valueKey] ? String(set[valueKey]) : ""}
  //       onChangeText={(value) => onSetChange(exercise.id, index, field, value)}
  //       onFocus={() => setIsFocused(true)} // When the input is focused
  //       onBlur={() => setIsFocused(false)} // When the input loses focus
  //     />
  //   ) : (
  //     <Text style={styles.setNumber} key={index}>
  //       {set[valueKey]}
  //     </Text>
  //     // <TouchableOpacity key={index} onPress={() => setIsEditing(true)}>
  //     //   <Text style={styles.setNumber}>
  //     //     {set[valueKey] ? set[valueKey] : placeholder}
  //     //   </Text>
  //     // </TouchableOpacity>
  //   );
  // };

  if (!exerciseType) {
    return <Text>No valid exercise type available.</Text>;
  }

  return (
    <View style={styles.setContainer}>
      <View style={styles.tableHeader}>
        <View style={styles.columnSet}>
          <Text style={styles.columnText}>SET</Text>
          {exercise.sets.map((set, index) => (
            <Text style={styles.setNumber}>{index + 1}</Text>
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
