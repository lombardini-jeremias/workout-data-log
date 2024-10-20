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
import { useWorkoutPlan } from "../../context/WorkoutPlanProvider";
import { SetService } from "../../services/Set.service";
import { ExerciseTypeService } from "../../services/ExerciseType.service";
import { ExerciseService } from "../../services/Exercise.service";

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
  const { setWorkoutPlanState } = useWorkoutPlan();

  useFocusEffect(
    useCallback(() => {
      const loadWorkoutPlans = async () => {
        const plans = await loadWorkoutPlansFromStorage();
        setWorkoutPlans(plans);
      };
      loadWorkoutPlans();
    }, [])
  );

  const handleNavigate = () => {
    router.push({
      pathname: "/(screens)/workoutPlanCreateScreen",
    });
  };

  const handleSelectWorkoutPlan = async (selectedWorkoutPlan) => {
    console.log("SELECTED-WP", selectedWorkoutPlan);

    const resolvedSets = await loadSetsForWorkoutPlan(
      selectedWorkoutPlan.setId
    );
    const exerciseNames = await loadExerciseNames(
      selectedWorkoutPlan.exerciseId
    );
    const exerciseTypes = await loadExerciseTypes(resolvedSets);

    // Update state after data has been fully resolved
    setWorkoutPlanState((prevState) => ({
      ...prevState,
      workoutPlan: selectedWorkoutPlan,
      sets: resolvedSets,
      exerciseNames,
      exerciseTypes,
    }));

    console.log("NAV-WP-STATE");
    router.push({
      pathname: "/(screens)/workoutPlanDetailScreen",
      params: {
        workoutPlanId: selectedWorkoutPlan.id,
      },
    });
  };

  const loadExerciseNames = async (exerciseIds) => {
    const names = {};
    await Promise.all(
      exerciseIds.map(async (exerciseId) => {
        const exercise = await ExerciseService.getById(exerciseId);
        names[exerciseId] = exercise?.name || "Unknown Exercise";
      })
    );
    return names;
  };

  const loadExerciseTypes = async (sets) => {
    const types = {};
    await Promise.all(
      sets.map(async (set) => {
        if (set.exerciseId && set.exerciseTypeId) {
          const type = await ExerciseTypeService.getById(set.exerciseTypeId);
          types[set.exerciseId] = type || null;
        }
      })
    );
    return types;
  };

  const loadSetsForWorkoutPlan = async (setIds) => {
    const sets = await Promise.all(
      setIds.map((setId) => SetService.getById(setId))
    );
    return sets.filter((set) => set !== undefined);
  };

  // const handleSelectWorkoutPlan = async (selectedWorkoutPlan) => {
  //   console.log("SELECTED-WP", selectedWorkoutPlan);

  //   setWorkoutPlanState((prevState) => ({
  //     ...prevState,
  //     workoutPlan: selectedWorkoutPlan,
  //     sets: loadSetsForWorkoutPlan(selectedWorkoutPlan.setId),
  //   }));

  //   console.log("NAV-WP-STATE");

  //   router.push({
  //     pathname: "/(screens)/workoutPlanDetailScreen",
  //     params: {
  //       workoutPlanId: selectedWorkoutPlan.id,
  //     },
  //   });
  // };

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
