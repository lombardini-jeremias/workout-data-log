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
      {/* <Stack.Screen
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
      /> */}
      <Stack.Screen
        name="personalExerciseListScreen"
        options={{
          title: "Personal Exercise List",
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
        name="personalExerciseDetailScreen"
        options={{
          title: "Personal Exercise Detail",
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
        name="exerciseCreateScreen"
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
      {/* <Stack.Screen
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
      /> */}

      <Stack.Screen
        name="workoutPlanCreateScreen"
        options={{
          title: "Create Workout Plan",
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="workoutPlanDetailScreen"
        options={{
          title: "Workout Plan Detail",
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
        name="workoutPlanEditScreen"
        options={{
          title: "Workout Plan Edit",
          headerBackTitle: "Back",
          headerBackTitleStyle: {},
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />
      {/* <Stack.Screen
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
      /> */}
      <Stack.Screen
        name="equipmentSelectionScreen"
        options={{
          title: "Select Equipment Type",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="muscleGroupSelectionScreen"
        options={{
          title: "Select Muscle Group Type",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="muscleGroupSecondarySelectionScreen"
        options={{
          title: "Select Muscle Group Type",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.dark.background,
          },
          headerTintColor: Colors.secondary,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="exerciseTypeSelectionScreen"
        options={{
          title: "Select Exercise Type",
          headerBackTitle: "Back",
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
