import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

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
        id: uuidv4(),
        ...setData,
      };
      const workout = await WorkoutService.getById(workoutId);
      if (!workout) throw new Error(`Workout with ID: ${workoutId} not found.`);
      const storedWorkoutExercises = await AsyncStorage.getItem(
        this.STORAGE_KEY
      );
      const workoutExercises: WorkoutExercise[] = storedWorkoutExercises
        ? JSON.parse(storedWorkoutExercises)
        : [];
      const workoutExercise = workoutExercises.find(
        (we) => we.workoutId === workoutId && we.exerciseId === exerciseId
      );
      if (!workoutExercise)
        throw new Error(`Workout Exercise with ID: ${exerciseId} not found.`);
      workoutExercise.sets.push(newSet);
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(workoutExercises)
      );
      return workoutExercise;
    } catch (error) {
      throw new Error(`Error creating set: ${error.message}`);
    }
  }

  // GET Sets by WorkoutExercise
  // It retrieves all sets for a specific exercise within a workout.
  // This is useful when displaying the performance history for that exercise.
  public static async getSetsByExercise(
    workoutId: string,
    exerciseId: string
  ): Promise<Set[] | undefined> {
    try {
      const storedWorkoutExercises = await AsyncStorage.getItem(
        this.STORAGE_KEY
      );
      const workoutExercises: WorkoutExercise[] = storedWorkoutExercises
        ? JSON.parse(storedWorkoutExercises)
        : [];
      const workoutExercise = workoutExercises.find(
        (we) => we.workoutId === workoutId && we.exerciseId === exerciseId
      );
      if (!workoutExercise)
        throw new Error(`Workout Exercise with ID: ${exerciseId} not found.`);
      return workoutExercise.sets;
    } catch (error) {
      throw new Error(`Error retrieving sets: ${error.message}`);
    }
  }

  // UPDATE Set
  public static async updateSet(
    workoutId: string,
    exerciseId: string,
    setId: string,
    updates: Partial<Set>
  ): Promise<Set | undefined> {
    try {
      const storedWorkoutExercises = await AsyncStorage.getItem(
        this.STORAGE_KEY
      );
      const workoutExercises: WorkoutExercise[] = storedWorkoutExercises
        ? JSON.parse(storedWorkoutExercises)
        : [];
      const workoutExercise = workoutExercises.find(
        (we) => we.workoutId === workoutId && we.exerciseId === exerciseId
      );
      if (!workoutExercise)
        throw new Error(`Workout Exercise with ID: ${exerciseId} not found.`);
      const setIndex = workoutExercise.sets.findIndex((s) => s.id === setId);
      if (setIndex === -1) throw new Error(`Set with ID: ${setId} not found.`);
      const updatedSet = { ...workoutExercise.sets[setIndex], ...updates };
      workoutExercise.sets[setIndex] = updatedSet;
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(workoutExercises)
      );
      return updatedSet;
    } catch (error) {
      throw new Error(`Error updating set: ${error.message}`);
    }
  }

  // DELETE Set
  public static async deleteSet(
    workoutId: string,
    exerciseId: string,
    setId: string
  ): Promise<boolean> {
    try {
      const storedWorkoutExercises = await AsyncStorage.getItem(
        this.STORAGE_KEY
      );
      const workoutExercises: WorkoutExercise[] = storedWorkoutExercises
        ? JSON.parse(storedWorkoutExercises)
        : [];
      const workoutExercise = workoutExercises.find(
        (we) => we.workoutId === workoutId && we.exerciseId === exerciseId
      );
      if (!workoutExercise)
        throw new Error(`Workout Exercise with ID: ${exerciseId} not found.`);
      const setIndex = workoutExercise.sets.findIndex((s) => s.id === setId);
      if (setIndex === -1) throw new Error(`Set with ID: ${setId} not found.`);
      workoutExercise.sets.splice(setIndex, 1);
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(workoutExercises)
      );
      return true;
    } catch (error) {
      throw new Error(`Error deleting set: ${error.message}`);
    }
  }
}
