import { Equipment } from "./Equipment.interface";
import { ExerciseType } from "./ExerciseType.interface";
import { MuscleGroup } from "./MuscleGroup.interface";

export interface Exercise {
  uuid: string;
  name: string;
  force_type: "pull" | "push" | "static";
  exercise_type: ExerciseType;
  mechanic_type: "compound" | "isolation";
  equipment: Equipment | Equipment[];
  primaryMuscles: MuscleGroup | MuscleGroup[];
  secondaryMuscles: MuscleGroup | MuscleGroup[];
  instructions: string[];
  image?: string;
  category: "strength" | "cardio" | "flexibility" | "hypertrophy";
}
