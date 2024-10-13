import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout } from "../interfaces/Workout.interface";

export class WorkoutService {
  private static readonly STORAGE_KEY = "workouts";

  // CREATE Workout
  public static async create(
    workoutData: Omit<Workout, "id">
  ): Promise<Workout> {
    if (!workoutData) {
      throw new Error("Workout data is missing.");
    }

    try {
      const newWorkout: Workout = {
        id: uuidv4(),
        ...workoutData,
      };

      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workouts: Workout[] = storedWorkouts
        ? JSON.parse(storedWorkouts)
        : [];

      workouts.push(newWorkout);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workouts));

      return newWorkout;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error creating new Workout: " + error.message);
      } else {
        throw new Error("Unknown error occurred while creating new Workout.");
      }
    }
  }

  // GET a Workout by UUID
  public static async getById(uuid: string): Promise<Workout | undefined> {
    if (!uuid) {
      throw new Error("UUID is required.");
    }

    try {
      // Retrieve workouts from AsyncStorage
      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workouts: Workout[] = storedWorkouts
        ? JSON.parse(storedWorkouts)
        : [];

      // Find the workout with the given UUID
      const workout = workouts.find((w) => w.id === uuid);
      if (!workout) {
        throw new Error(`Workout with UUID: ${uuid} not found.`);
      }

      return workout;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error searching Workout by UUID" + error.message);
      } else {
        throw new Error(
          "Unknown error occurred while searching Workout by UUID."
        );
      }
    }
  }

  // GET all Workouts
  public static async getAll(): Promise<Workout[]> {
    try {
      // Retrieve workouts from AsyncStorage
      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workouts: Workout[] = storedWorkouts
        ? JSON.parse(storedWorkouts)
        : [];

      return workouts;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error retrieving all workouts" + error.message);
      } else {
        throw new Error("Unknown error occurred retrieving all workouts.");
      }
    }
  }

  // UPDATE/PATCH a Workout by UUID
  public static async update(
    uuid: string,
    updates: Partial<Workout>
  ): Promise<Workout | undefined> {
    if (!uuid) {
      throw new Error("UUID is required for updating a workout.");
    }

    try {
      // Retrieve existing workouts from AsyncStorage
      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workouts: Workout[] = storedWorkouts
        ? JSON.parse(storedWorkouts)
        : [];

      // Find the workout to update
      const workoutIndex = workouts.findIndex((w) => w.id === uuid);
      if (workoutIndex === -1) {
        throw new Error(`Workout with UUID: ${uuid} not found.`);
      }
      const updatedWorkout = { ...workouts[workoutIndex], ...updates };
      workouts[workoutIndex] = updatedWorkout;

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workouts));

      return updatedWorkout;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error updating workout: " + error.message);
      } else {
        throw new Error("Unknown error occurred updating workout.");
      }
    }
  }

  // DELETE a Workout by UUID
  public static async delete(uuid: string): Promise<boolean> {
    if (!uuid) {
      throw new Error("UUID is required for deleting a workout.");
    }

    try {
      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workouts: Workout[] = storedWorkouts
        ? JSON.parse(storedWorkouts)
        : [];

      const workoutIndex = workouts.findIndex((w) => w.id === uuid);
      if (workoutIndex === -1) {
        throw new Error(`Workout with UUID: ${uuid} not found.`);
      }
      workouts.splice(workoutIndex, 1);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workouts));

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error deleting workout: " + error.message);
      } else {
        throw new Error("Unknown error occurred deleting workout.");
      }
    }
  }
}
