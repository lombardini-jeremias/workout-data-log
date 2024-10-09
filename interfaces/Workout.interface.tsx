import { Exercise } from "./Exercise.interface";

// export interface Workout {
//   uuid: string;
//   title: string;
//   start_time: string;
//   end_time?: string;
//   description?: string;
//   exercise_title: string;
//   superset_id: string;
//   exercise_note?: string;
//   set_index: number;
//   set_type?: "normal" | "warm up" | "failure" | "drop";
//   reps: number;
//   weight_kg?: number;
//   distance_km?: number;
//   duration_seconds?: number;
//   rpe?: number;
// }

export interface Workout {
  uuid: string;
  title: string;
  start_time: string;
  end_time?: string;
  description?: string;
  exercise: Exercise;
  exercise_note?: string;
  set_index: number;
  set_type?: "normal" | "warm up" | "failure" | "drop";
  rpe?: number;
}
