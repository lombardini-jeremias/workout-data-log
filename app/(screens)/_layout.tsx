import { Stack } from "expo-router";
import { Colors } from "../../constants/Colors";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="ExerciseListScreen"
        options={{
          title: "Exercise List",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="CreateExerciseScreen"
        options={{
          title: "Create Exercise",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ExerciseDetailScreen"
        options={{
          title: "Exercise Detail",
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerShown: true,
        }}
      />
    </Stack>
  );
}
