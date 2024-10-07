import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

interface RightSecondaryButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const RightSecondaryButton: React.FC<RightSecondaryButtonProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RightSecondaryButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  text: {
    color: "#FFF",
    fontSize: 17,
  },
});
