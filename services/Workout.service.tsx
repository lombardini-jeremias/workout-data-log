import { Workout } from "../interfaces/Workout.interface";

let workouts: Workout[] = [];

export class WorkoutService {
  // CREATE Workout
  public static create(workout: Workout): Workout {
    if (!workout || !workout.uuid) {
      throw new Error("Workout must have a valid uuid.");
    }
    workouts.push(workout);
    return workout;
  }

  // GET a Workout by UUID
  static getById(uuid: string): Workout | undefined {
    const workout = workouts.find((workout) => workout.uuid === uuid);
    if (!workout) {
      throw new Error(`Workout with UUID: ${uuid} not found.`);
    }
    return workout;
  }

  // GET all Workouts
  static getAll(): Workout[] {
    return workouts;
  }

  // UPDATE/PATCH a Workout by UUID
  static update(uuid: string, updates: Partial<Workout>): Workout | undefined {
    const workoutIndex = workouts.findIndex((workout) => workout.uuid === uuid);
    if (workoutIndex === -1) {
      throw new Error(`Workout with UUID: ${uuid} not found.`);
    }

    // Validate updates (you can add more specific validations as needed)
    if (updates.uuid && updates.uuid !== uuid) {
      throw new Error("Cannot change the UUID of a workout.");
    }

    workouts[workoutIndex] = { ...workouts[workoutIndex], ...updates };
    return workouts[workoutIndex];
  }

  // DELETE a Workout by UUID
  static delete(uuid: string): boolean {
    const workoutIndex = workouts.findIndex((workout) => workout.uuid === uuid);
    if (workoutIndex === -1) {
      throw new Error(`Workout with UUID: ${uuid} not found.`);
    }
    workouts.splice(workoutIndex, 1);
    return true;
  }
}
