import { Set } from "./Set.interface";

export interface WorkoutExercise {
  id: string; // Unique identifier for this instance of an exercise in a workout
  workoutId: string; // Reference to the workout this exercise belongs to
  exerciseId: string; // Reference to the exercise being performed
  sets: Set[]; // Array of sets performed for this exercise
  order: number; // Order of the exercise in the workout (e.g., 1st exercise, 2nd, etc.)
}
