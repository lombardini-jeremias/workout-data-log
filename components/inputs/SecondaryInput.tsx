import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface SecondaryInputProps {
  title: string;
  onPress: () => void;
  selectedEquipment: string;
}

const SecondaryInput: React.FC<SecondaryInputProps> = ({
  title,
  onPress,
  selectedEquipment,
}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.inputText}>{title}</Text>
        <Text style={styles.inputSelect}>{selectedEquipment || "Select"}</Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputText: {
    fontSize: 18,
    marginBottom: 5,
    color: Colors.text,
  },
  inputSelect: {
    fontSize: 18,
    color: Colors.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
});

export default SecondaryInput;
