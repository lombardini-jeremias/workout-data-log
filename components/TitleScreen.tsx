import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

export default function TitleScreen({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <ThemedView>
        <ThemedText type="title">{title}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
});
