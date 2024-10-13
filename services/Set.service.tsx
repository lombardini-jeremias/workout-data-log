import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Set } from "../interfaces/Set.interface";
import { WorkoutExercise } from "../interfaces/WorkoutExercise.interface";
import { WorkoutService } from "./Workout.service";

export class SetService {
  private static readonly STORAGE_KEY = "workoutExercises";

  // CREATE Set for a WorkoutExercise
  public static async createSet(
    workoutId: string,
    exerciseId: string,
    setData: Omit<Set, "id">
  ): Promise<WorkoutExercise | undefined> {
    try {
      const newSet: Set = {
        id: uuidv4(),               // Generate unique ID for the set
        ...setData,                 // Spread the rest of the setData into the newSet
      };

      // Retrieve the workout and corresponding exercise
      const workout = await WorkoutService.getById(workoutId);
      if (!workout) {
        throw new Error(`Workout with ID: ${workoutId} not found.`);
      }

      const storedWorkoutExercises = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workoutExercises: WorkoutExercise[] = storedWorkoutExercises
        ? JSON.parse(storedWorkoutExercises)
        : [];

      // Find the correct workoutExercise instance
      const workoutExercise = workoutExercises.find(
        (we) => we.workoutId === workoutId && we.exerciseId === exerciseId
      );

      if (!workoutExercise) {
        throw new Error(`Workout Exercise with ID: ${exerciseId} not found.`);
      }

      // Add the new set to the workout exercise
      workoutExercise.sets.push(newSet);

      // Save back to AsyncStorage
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workoutExercises));
      return workoutExercise;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error creating set: " + error.message);
      } else {
        throw new Error("Unknown error occurred while creating set.");
      }
    }
  }

  // GET Sets for a specific WorkoutExercise
  public static async getSetsByExercise(
    workoutId: string,
    exerciseId: string
  ): Promise<Set[] | undefined> {
    try {
      const storedWorkoutExercises = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workoutExercises: WorkoutExercise[] = storedWorkoutExercises
        ? JSON.parse(storedWorkoutExercises)
        : [];

      const workoutExercise = workoutExercises.find(
        (we) => we.workoutId === workoutId && we.exerciseId === exerciseId
      );

      if (!workoutExercise) {
        throw new Error(`Workout Exercise with ID: ${exerciseId} not found.`);
      }

      return workoutExercise.sets;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error retrieving sets: " + error.message);
      } else {
        throw new Error("Unknown error occurred while retrieving sets.");
      }
    }
  }

  // UPDATE a specific Set
  public static async updateSet(
    workoutId: string,
    exerciseId: string,
    setId: string,
    updates: Partial<Set>
  ): Promise<Set | undefined> {
    try {
      const storedWorkoutExercises = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workoutExercises: WorkoutExercise[] = storedWorkoutExercises
        ? JSON.parse(storedWorkoutExercises)
        : [];

      const workoutExercise = workoutExercises.find(
        (we) => we.workoutId === workoutId && we.exerciseId === exerciseId
      );

      if (!workoutExercise) {
        throw new Error(`Workout Exercise with ID: ${exerciseId} not found.`);
      }

      const setIndex = workoutExercise.sets.findIndex((s) => s.id === setId);
      if (setIndex === -1) {
        throw new Error(`Set with ID: ${setId} not found.`);
      }

      // Apply updates to the existing set
      const updatedSet = { ...workoutExercise.sets[setIndex], ...updates };
      workoutExercise.sets[setIndex] = updatedSet;

      // Save back to AsyncStorage
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workoutExercises));
      return updatedSet;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error updating set: " + error.message);
      } else {
        throw new Error("Unknown error occurred while updating set.");
      }
    }
  }

  // DELETE a specific Set
  public static async deleteSet(
    workoutId: string,
    exerciseId: string,
    setId: string
  ): Promise<boolean> {
    try {
      const storedWorkoutExercises = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workoutExercises: WorkoutExercise[] = storedWorkoutExercises
        ? JSON.parse(storedWorkoutExercises)
        : [];

      const workoutExercise = workoutExercises.find(
        (we) => we.workoutId === workoutId && we.exerciseId === exerciseId
      );

      if (!workoutExercise) {
        throw new Error(`Workout Exercise with ID: ${exerciseId} not found.`);
      }

      const setIndex = workoutExercise.sets.findIndex((s) => s.id === setId);
      if (setIndex === -1) {
        throw new Error(`Set with ID: ${setId} not found.`);
      }

      // Remove the set from the workoutExercise
      workoutExercise.sets.splice(setIndex, 1);

      // Save back to AsyncStorage
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workoutExercises));
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error deleting set: " + error.message);
      } else {
        throw new Error("Unknown error occurred while deleting set.");
      }
    }
  }
}
