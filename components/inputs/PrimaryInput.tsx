import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors"; // Adjust the path as necessary

interface PrimaryInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const PrimaryInput: React.FC<PrimaryInputProps> = ({
  placeholder,
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        value={value}
        onChangeText={onChangeText}
      />
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 10,
  },
  inputText: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
});

export default PrimaryInput;
