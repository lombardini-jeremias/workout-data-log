import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Containers } from "../../constants/Container";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={Containers.screenContainer}>
      <ScrollView>
        <ThemedView style={Containers.titleContainer}>
          <ThemedText type="title">Workout Data Log</ThemedText>
        </ThemedView>

        <ThemedView style={styles.cardContainers}>
          <TouchableOpacity>
            <ThemedView style={styles.stepContainer}>
              <ThemedText type="card">
                <ThemedText type="cardText">Day Activity</ThemedText>
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              (router as any).push({
                pathname: "ExerciseListScreen",
                params: { fromScreen: "Index" },
              })
            }
          >
            <ThemedView style={styles.stepContainer}>
              <ThemedView style={styles.card}>
                <Text style={styles.cardText}>Exercises List</Text>
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>

          <TouchableOpacity>
            <ThemedView style={styles.stepContainer}>
              <ThemedText type="card">
                <ThemedText type="cardText">Export data</ThemedText>
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  cardContainers: {
    marginTop: 50,
  },
  card: {
    backgroundColor: "#151718",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#9BA1A6",
    borderWidth: 1,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});
