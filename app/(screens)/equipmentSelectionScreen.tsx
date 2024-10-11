import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Containers } from "@/constants/Container";
import { Colors } from "@/constants/Colors";
import { Equipment } from "../../interfaces/Equipment.interface";
import { EquipmentService } from "../../services/Equipment.service";
import { useExerciseForm } from "../../context/ExerciseFormProvider";

export default function EquipmentSelectionScreen() {
  const router = useRouter();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const { setExerciseForm } = useExerciseForm();

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
    setExerciseForm((prev) => ({
      ...prev,
      equipmentId: equipment.uuid,
      equipmentName: equipment.name,
    }));
    router.back();
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
