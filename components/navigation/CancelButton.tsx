import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { Colors } from "../../constants/Colors";

interface CancelButtonProps {
  onPress: (event: GestureResponderEvent) => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>Cancel</Text>
    </TouchableOpacity>
  );
};

export default CancelButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: Colors.secondary,
    fontSize: 17,
  },
});
