export interface Exercise {
  uuid: string;
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
