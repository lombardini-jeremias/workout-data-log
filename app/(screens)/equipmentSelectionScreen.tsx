import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Containers } from "@/constants/Container";
import { Colors } from "@/constants/Colors";
import { Equipment } from "../../interfaces/Equipment.interface";
import { EquipmentService } from "../../services/Equipment.service";
import SecondaryInput from "../../components/inputs/SecondaryInput";

export default function EquipmentSelectionScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

  useEffect(() => {
    const loadPreloadedData = async () => {
      try {
        const fetchData = await EquipmentService.getAll();
        setEquipmentList(fetchData);
      } catch (error) {
        console.error("Error loading equipment data", error);
      }
    };
    loadPreloadedData();
  }, []);

  const handleSelect = (equipment: Equipment) => {
    router.push({
      pathname: "/(screens)/createExerciseScreen",
      params: { selectedEquipment: equipment.name },
    });
    console.log("selected-Equipment", equipment);
  };

  return (
    <View style={Containers.screenContainer}>
      <View style={styles.equipmentContainer}>
        {equipmentList.map((equipment, index) => (
          <TouchableOpacity key={index} onPress={() => handleSelect(equipment)}>
            <Text style={styles.equipmentText}>{equipment.name}</Text>
            <View style={styles.separator} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  equipmentContainer: {
    marginTop: 10,
    paddingTop: 10,
  },
  equipmentText: {
    fontSize: 20,
    marginBottom: 5,
    color: Colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
});
