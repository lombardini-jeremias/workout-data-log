import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

interface TextOrInputProps {
  isEditable?: boolean;
  value: string | string[];
  placeholder?: string;
  onChangeText?: (text: string) => void;
}

export default function TextOrInput({
  isEditable = false,
  value,
  placeholder = "",
  onChangeText = () => {},
}: TextOrInputProps) {
  return (
    <View style={styles.container}>
      {isEditable ? (
        <TextInput
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray}
          value={typeof value === "string" ? value : value.join(", ")}
          onChangeText={onChangeText}
        />
      ) : (
        <Text style={styles.displayText}>
          {typeof value === "string" ? value : value.join(", ")} {}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  inputText: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  displayText: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
});
