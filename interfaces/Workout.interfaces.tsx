export interface Workout {
  uuid: string;
  date: string;
  exerciseId: string;
  dayActivityId: string;
  sets: number[];
  reps: number[];
  weight: number[];
  comment?: string;
}
