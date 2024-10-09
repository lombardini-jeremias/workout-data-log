export enum MuscleGroupCategory {
  BACK = "back",
  CHEST = "chest",
  CORE = "core",
  SHOULDERS = "shoulders",
  ARMS = "arms",
  LEGS = "legs",
}

export interface MuscleGroup {
  uuid: string;
  name: string;
  category: MuscleGroupCategory;
  image?: string;
}
