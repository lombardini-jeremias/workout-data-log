export interface WorkoutPlan {
  id: string;
  name: string;
  exerciseId: string; // Reference to the exercise being performed
  setId: string[]; // Array of setId performed for this exercise
}
