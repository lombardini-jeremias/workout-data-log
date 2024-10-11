import React from "react";
import { Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface ExerciseNoteProps {
  note?: string;
}

const ExerciseNote: React.FC<ExerciseNoteProps> = ({ note }) => {
  if (!note) return null;

  return <Text style={styles.noteText}>Note: {note}</Text>;
};

const styles = StyleSheet.create({
  noteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: Colors.text,
    marginTop: 8,
  },
});

export default ExerciseNote;
