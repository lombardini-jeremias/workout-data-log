export enum MuscleGroupCategory {
  BACK = "back",
  CHEST = "chest",
  CORE = "core",
  SHOULDERS = "shoulders",
  ARMS = "arms",
  LEGS = "legs",
  CARDIO = "cardio",
  FULL_BODY = "full_body",
}

export interface MuscleGroup {
  id: string;
  name: string;
  category: MuscleGroupCategory;
  image?: string;
}
