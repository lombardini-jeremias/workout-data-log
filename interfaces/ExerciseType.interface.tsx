export enum ExerciseTypeCategory {
  WEIGHTED_REPS = "Weighted & Reps",
  BODYWEIGHT_REPS = "Bodyweight Reps",
  BODYWEIGHT_WEIGHTED = "Bodyweight Weighted",
  ASSISTED_BODYWEIGHT = "Assisted Bodyweight",
  DURATION = "Duration",
  DURATION_WEIGHT = "Duration & Weight",
  DISTANCE_DURATION = "Distance & Duration",
  WEIGHT_DISTANCE = "Weight & Distance",
}

export interface ExerciseType {
  uuid: string;
  type: ExerciseTypeCategory;
  reps?: number;
  weightKg?: number;
  durationSeconds?: number;
  distanceKm?: number;
}
