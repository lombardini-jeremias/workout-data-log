export interface Exercise {
  id: number;
  name: string;
  force: "pull" | "push" | "static";
  level: "beginner" | "intermediate" | "advanced";
  mechanic: "compound" | "isolation";
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: "strength" | "cardio" | "flexibility";
}
// force: 'pull' | 'push' | 'static';
