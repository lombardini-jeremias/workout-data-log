export interface Exercise {
  id: string;
  name: string;
  equipmentId: string;
  primaryMusclesGroupId: string;
  secondaryMusclesGroupId: string | string[];
  exerciseTypeId: string;
  forceType?: "pull" | "push" | "static";
  mechanicType?: "compound" | "isolation";
  instructions?: string[];
  image?: string;
}
