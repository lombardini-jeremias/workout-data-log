export interface ExerciseType {
  uuid: string;
  type:
    | "Weighted & Reps"
    | "Bodyweight Reps"
    | "Assisted Bodyweight"
    | "Duration"
    | "Duration & Weight"
    | "Distance & Duration"
    | "Weight & Distance";
  reps?: number;
  weight_kg?: number;
  duration_seconds?: number;
  distance_km?: number;
}
