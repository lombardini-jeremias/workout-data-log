import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout } from "../interfaces/Workout.interface";

let workouts: Workout[] = [];

export class WorkoutService {
  private static readonly STORAGE_KEY = "workouts";

  // CREATE Workout
  public static async create(
    workoutData: Omit<Workout, "uuid">
  ): Promise<Workout> {
    if (!workoutData) {
      throw new Error("Workout data is missing.");
    }

    try {
      const newWorkout: Workout = {
        uuid: uuidv4(),
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
      throw new Error("Error creating a new workout: " + error.message);
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
      const workout = workouts.find((w) => w.uuid === uuid);
      if (!workout) {
        throw new Error(`Workout with UUID: ${uuid} not found.`);
      }

      return workout;
    } catch (error) {
      throw new Error("Error retrieving workout: " + error.message);
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
      throw new Error("Error retrieving all workouts: " + error.message);
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
      const workoutIndex = workouts.findIndex((w) => w.uuid === uuid);
      if (workoutIndex === -1) {
        throw new Error(`Workout with UUID: ${uuid} not found.`);
      }

      // Merge updates into the workout
      const updatedWorkout = { ...workouts[workoutIndex], ...updates };

      // Update the workout in the list
      workouts[workoutIndex] = updatedWorkout;

      // Save updated workouts list back to AsyncStorage
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workouts));

      return updatedWorkout;
    } catch (error) {
      throw new Error("Error updating workout: " + error.message);
    }
  }

  // DELETE a Workout by UUID
  public static async delete(uuid: string): Promise<boolean> {
    if (!uuid) {
      throw new Error("UUID is required for deleting a workout.");
    }

    try {
      // Retrieve existing workouts from AsyncStorage
      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workouts: Workout[] = storedWorkouts
        ? JSON.parse(storedWorkouts)
        : [];

      // Find the workout to delete
      const workoutIndex = workouts.findIndex((w) => w.uuid === uuid);
      if (workoutIndex === -1) {
        throw new Error(`Workout with UUID: ${uuid} not found.`);
      }

      // Remove the workout from the array
      workouts.splice(workoutIndex, 1);

      // Save updated workouts list back to AsyncStorage
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workouts));

      return true;
    } catch (error) {
      throw new Error("Error deleting workout: " + error.message);
    }
  }
}
