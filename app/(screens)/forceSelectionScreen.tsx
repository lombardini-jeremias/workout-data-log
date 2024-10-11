// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import { Containers } from "@/constants/Container";
// import { Colors } from "@/constants/Colors";
// import { MuscleGroup } from "../../interfaces/MuscleGroup.interface";
// import { MuscleGroupService } from "../../services/MuscleGroup.service";

// export default function ForceSelectionScreen() {
//   const router = useRouter();
//   const [muscleGroupList, setMuscleGroupList] = useState<MuscleGroup[]>([]);

//   useEffect(() => {
//     const loadPreloadedData = async () => {
//       try {
//         const fetchData = await MuscleGroupService.getAll();
//         setMuscleGroupList(fetchData);
//         console.log("fetchData", fetchData);
//       } catch (error) {
//         console.error("Error loading equipment data", error);
//       }
//     };
//     loadPreloadedData();
//   }, []);

//   const handleSelect = (muscleGroup: MuscleGroup) => {
//     router.push({
//       pathname: "/(screens)/createExerciseScreen",
//       params: { selectedEquipment: muscleGroup.name },
//     });
//     console.log("selected-muscleGroup", muscleGroup);
//   };

//   return (
//     <View style={Containers.screenContainer}>
//       {muscleGroupList.map((muscleGroup, index) => (
//         <TouchableOpacity
//           key={index}
//           onPress={() => handleSelect(muscleGroup)}
//           style={styles.muscleGroupItem}
//         >
//           <Text style={styles.muscleGroupText}>{muscleGroup.name}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   muscleGroupItem: {
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.gray,
//   },
//   muscleGroupText: {
//     fontSize: 18,
//     color: Colors.text,
//   },
// });
