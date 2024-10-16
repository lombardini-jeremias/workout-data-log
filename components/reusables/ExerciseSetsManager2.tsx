import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";

import { ExerciseTypeCategory } from "../../interfaces/ExerciseType.interface";

import ButtonPrimary from "../buttons/ButtonPrimary";
import BottomSheetReusable from "./BottomSheetReusable";

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
  onDeleteSet: (exerciseId: string, setIndex: number) => void; // Add this prop
  exerciseType?: ExerciseTypeCategory;
}

export default function ExerciseSetsManager2({
  exercise,
  isEditable,
  onSetChange,
  onAddSet,
  onDeleteSet,
  exerciseType,
}: ExerciseSetsManager2Props) {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null); // Store selected set index

  const openBottomSheet = (index: number) => {
    if (selectedSetIndex !== index) {
      console.log("Opening BOTTOM-SHEET SET index:", index);
      setSelectedSetIndex(null);
      setSelectedSetIndex(index);
      setBottomSheetVisible(true);
    }
  };

  const closeBottomSheet = (index: number) => {
    console.log("Closing BOTTOM-SHEET", index);
    setSelectedSetIndex(null);
    setBottomSheetVisible(false);
  };

  const renderField = (set, index, field, placeholder, valueKey) => {
    return isEditable ? (
      <TextInput
        key={index}
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

  const handleDeleteSet = () => {
    if (selectedSetIndex !== null) {
      onDeleteSet(exercise.id, selectedSetIndex);
      console.log("SET-INDEX", selectedSetIndex, exercise.id);
      setBottomSheetVisible(false);
      setSelectedSetIndex(null);
    }
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
            <TouchableOpacity
              key={index}
              onPress={() => openBottomSheet(index)} // Open the bottom sheet when set number is pressed
            >
              <Text style={styles.setNumber}>{index + 1}</Text>
            </TouchableOpacity>
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

      {/* Render the Bottom Sheet */}
      <BottomSheetReusable
        isVisible={isBottomSheetVisible}
        onClose={closeBottomSheet}
        // onClose={() => setBottomSheetVisible(false)}
        onDeleteSet={handleDeleteSet}
      />
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
