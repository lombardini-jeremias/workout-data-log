import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { Containers } from "../../constants/Container";
import SaveButton from "../../components/navigation/SaveButton";
import CancelButton from "../../components/navigation/CancelButton";
import ButtonSecondary from "../../components/buttons/ButtonSecondary";
import { Exercise } from "../../interfaces/Exercise.interfaces";

const saveDayActivitiesToStorage = async (dayActivities) => {
  try {
    const jsonValue = JSON.stringify(dayActivities);
    await AsyncStorage.setItem("dayActivities", jsonValue);
  } catch (error) {
    console.error("Error saving day activities", error);
  }
};

const formatActivityName = (name) => {
  return name.trim().toUpperCase().replace(/\s+/g, "_");
};

export default function CreateDayActivity() {
  const [activityName, setActivityName] = useState("");
  const navigation = useNavigation();
  const router = useRouter();
  const { selectedExercises: selectedExercisesString } = useLocalSearchParams();

  const selectedExercises =
    typeof selectedExercisesString === "string"
      ? JSON.parse(selectedExercisesString)
      : selectedExercisesString;

  const addDayActivity = async () => {
    // if (!activityName) {
    //   Alert.alert("Please enter a name for the day activity");
    //   return;
    // }
    // const formattedName = formatActivityName(activityName);
    // const newDayActivity = { id: uuidv4(), name: formattedName };
    // try {
    //   const jsonValue = await AsyncStorage.getItem("dayActivities");
    //   const dayActivities = jsonValue != null ? JSON.parse(jsonValue) : [];
    //   const activityExists = dayActivities.some(
    //     (activity) => activity.name === formattedName
    //   );
    //   if (activityExists) {
    //     Alert.alert("Activity already exists!");
    //     return;
    //   }
    //   const updatedDayActivities = [...dayActivities, newDayActivity];
    //   await saveDayActivitiesToStorage(updatedDayActivities);
    //   Alert.alert("Day Activity saved!");
    //   setActivityName("");
    //   navigation.goBack();
    // } catch (error) {
    //   console.error("Error loading or saving day activities", error);
    // }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CancelButton />,
      headerRight: () => <SaveButton onPress={handleSave} />,
    });
  }, [navigation]);

  // const handleNavigate = () => {
  //   navigation.navigate("exerciseListScreen");
  // };
  const handleNavigate = () => {
    router.push("exerciseListScreen");
  };

  const handleSave = () => {};

  return (
    <View style={Containers.screenContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Day Activity Name"
          placeholderTextColor={Colors.gray}
          value={activityName}
          onChangeText={setActivityName}
        />
      </View>
      <View style={styles.separator} />

      <View>
        <FlatList
          data={selectedExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View>
                <Text style={styles.exerciseText}>Name: {item.name}</Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.noExercisesText}>
              Start adding an Exercise to the Day Activity.
            </Text>
          }
        />
      </View>

      <ButtonSecondary title="Add Exercise" onPress={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {},
  inputContainer: {
    paddingTop: 10,
  },
  inputText: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 10,
  },
  exerciseText: {
    color: "white",
  },
  noExercisesText: {
    color: Colors.gray,
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
