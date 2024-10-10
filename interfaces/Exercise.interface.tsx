import { Equipment } from "./Equipment.interface";
import { ExerciseType } from "./ExerciseType.interface";
import { MuscleGroup } from "./MuscleGroup.interface";

export interface Exercise {
  uuid: string;
  name: string;
  forceType: "pull" | "push" | "static";
  exerciseType: ExerciseType;
  mechanicType: "compound" | "isolation";
  equipment: Equipment | Equipment[];
  primaryMuscles: MuscleGroup | MuscleGroup[];
  secondaryMuscles: MuscleGroup | MuscleGroup[];
  instructions?: string[];
  image?: string;
}
