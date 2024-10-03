import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Colors } from "@/constants/Colors";

interface CreateButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: Colors.secondary,
    fontSize: 17,
  },
});

export default CreateButton;
