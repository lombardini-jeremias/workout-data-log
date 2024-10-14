export interface Exercise {
  id: string;
  name: string;
  equipmentId: string;
  primaryMuscleGroupId: string;
  secondaryMuscleGroupId: string | string[];
  exerciseTypeId: string;
  forceType?: "pull" | "push" | "static";
  instructions?: string[];
  image?: string;
}
