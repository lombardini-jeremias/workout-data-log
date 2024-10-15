export interface Set {
  id: string;
  exerciseId: string;
  setIndex: number; // Set number (1 set, 2 set, etc.)
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  restTime?: number; // Rest time between sets (optional, in seconds)
  rpe?: number; // Rate of perceived exertion (optional)
  exerciseTypeId: string; // Reference to the ExerciseType entity
}
