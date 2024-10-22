import React, { useState } from "react";

import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Containers } from "../../constants/Container";
import TitleScreen from "../../components/TitleScreen";
import BottomSheetReusable from "../../components/reusables/BottomSheetReusable";

export default function HomeScreen() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/(screens)/storageViewerScreen");
  };

  return (
    <ThemedView style={Containers.tabContainer}>
      <ScrollView>
        <TitleScreen title="Workout Data Log" />

        <ThemedView style={styles.cardContainers}>
          <TouchableOpacity onPress={handleNavigate}>
            <ThemedView style={styles.stepContainer}>
              <ThemedText type="card">
                <ThemedText type="cardText">StorageViewer</ThemedText>
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
