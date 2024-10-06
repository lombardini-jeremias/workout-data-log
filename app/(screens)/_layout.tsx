import { Stack } from "expo-router";
import { Colors } from "../../constants/Colors";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="storageViewerScreen"
        options={{
          title: "Storage Viewer",
          headerBackTitle: "Back",
          headerBackTitleStyle: {},
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="exerciseListScreen"
        options={{
          title: "Exercise List",
          headerBackTitle: "Back",
          headerBackTitleStyle: {},
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="createExerciseScreen"
        options={{
          title: "Create Exercise",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="exerciseDetailScreen"
        options={{
          title: "Exercise Detail",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="createDayActivityScreen"
        options={{
          title: "Create Day Activity",
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="dayActivityDetailScreen"
        options={{
          title: "Day Activity Detail",
          headerBackTitle: "Back",
          headerBackTitleStyle: {},
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="dayActivityEditScreen"
        options={{
          title: "Edit Day Activity",
          headerBackTitle: "Back",
          headerBackTitleStyle: {},
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />
    </Stack>
  );
}
