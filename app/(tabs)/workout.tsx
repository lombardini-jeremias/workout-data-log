import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { Containers } from "@/constants/Container";

import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import BottomSheetReusable from "../../components/reusables/BottomSheetReusable";

// Load workout plans from AsyncStorage
const loadWorkoutPlansFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("workoutPlans");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error loading workout plans", error);
    return [];
  }
};

export default function Workout() {
  const router = useRouter();
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const handleNavigate = () => {
    router.push({
      pathname: "/(screens)/workoutPlanCreateScreen",
    });
  };

  const handleSelectWorkoutPlan = (selectedWorkoutPlan) => {
    router.push({
      pathname: "/(screens)/workoutPlanDetailScreen",
      params: {
        workoutPlanId: selectedWorkoutPlan.id,
        workoutPlanName: selectedWorkoutPlan.name,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      const loadWorkoutPlans = async () => {
        const plans = await loadWorkoutPlansFromStorage();
        setWorkoutPlans(plans);
      };
      loadWorkoutPlans();
    }, [])
  );

  return (
    <View style={Containers.screenContainer}>
      <Text>Workout Plans</Text>
      
      <ButtonPrimary title={"New Workout Plan"} onPress={handleNavigate} />
      
      <View>
        <FlatList
          data={workoutPlans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectWorkoutPlan(item)}>
              <View style={styles.itemContainer}>
                <Text style={styles.title}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: 16,
    color: "white",
  },
});
