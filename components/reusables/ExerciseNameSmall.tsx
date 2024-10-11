import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface ExerciseNameSmallProps {
  exerciseId: string;
  onPress: (exerciseId: string) => void;
  getExerciseNameById: (id: string) => string;
}

const ExerciseNameSmall: React.FC<ExerciseNameSmallProps> = ({
  exerciseId,
  onPress,
  getExerciseNameById,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(exerciseId)}>
      <Text style={styles.exerciseText}>{getExerciseNameById(exerciseId)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: "bold",
  },
});

export default ExerciseNameSmall;
