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
import { DayActivity } from "@/interfaces/DayActivity.interfaces";

// loadData
const loadDayActivitiesFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("dayActivities");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error loading day activities", error);
    return [];
  }
};

export default function Workout() {
  const router = useRouter();
  const [dayActivities, setDayActivities] = useState<DayActivity[]>([]);

  const handleNavigate = () => {
    router.push({
      pathname: "createDayActivityScreen",
    });
  };

  const handleSelectDayActivity = (selectedDayActivity: DayActivity) => {
    router.push({
      pathname: "/(screens)/dayActivityDetailScreen",
      params: {
        selectedDayActivityId: selectedDayActivity.uuid,
        selectedDayActivityName: selectedDayActivity.name,
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      const loadDayActivities = async () => {
        const activities = await loadDayActivitiesFromStorage();
        setDayActivities(activities);
      };
      loadDayActivities();

      return () => {
        console.log("Screen unfocused");
      };
    }, [])
  );

  return (
    <View style={Containers.screenContainer}>
      <Text>Workout Screen</Text>
      <View>
        <Text>Activities</Text>
        <ButtonPrimary title={"New Activity"} onPress={handleNavigate} />

        <View>
          <FlatList
            data={dayActivities}
            keyExtractor={(item: DayActivity) => item.uuid}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectDayActivity(item)}>
                <View style={styles.itemContainer}>
                  <Text style={styles.title}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    backgroundColor: Colors.dark.background,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
