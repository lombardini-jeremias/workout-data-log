// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import { Containers } from "@/constants/Container";
// import { Colors } from "@/constants/Colors";
// import { Equipment } from "../../interfaces/Equipment.interface";
// import { EquipmentService } from "../../services/Equipment.service";

// export default function MechanicSelectionScreen() {
//   const router = useRouter();
//   const [mechanicList, setMechanicList] = useState<[]>([]);

//   useEffect(() => {
//     const loadPreloadedData = async () => {
//       try {
//         const fetchData = await EquipmentService.getAll();
//         setMechanicList(fetchData);
//       } catch (error) {
//         console.error("Error loading equipment data", error);
//       }
//     };
//     loadPreloadedData();
//   }, []);

//   const handleSelect = (mechanic: Equipment) => {
//     router.push({
//       pathname: "/(screens)/createExerciseScreen",
//       params: { selectedMechanic: mechanic.name },
//     });
//     console.log("selected-Equipment", mechanic);
//   };

//   return (
//     <View style={Containers.screenContainer}>
//       <View style={styles.equipmentContainer}>
//         {mechanicList.map((equipment, index) => (
//           <TouchableOpacity key={index} onPress={() => handleSelect(equipment)}>
//             <Text style={styles.equipmentText}>{equipment.name}</Text>
//             <View style={styles.separator} />
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   equipmentContainer: {
//     marginTop: 10,
//     paddingTop: 10,
//   },
//   equipmentText: {
//     fontSize: 20,
//     marginBottom: 5,
//     color: Colors.text,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: Colors.gray,
//     marginVertical: 10,
//   },
// });
