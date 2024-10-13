import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout } from "../interfaces/Workout.interface";

export class WorkoutService {
  private static readonly STORAGE_KEY = "workouts";

  // CREATE Workout
  public static async create(
    workoutData: Omit<Workout, "id">
  ): Promise<Workout> {
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
      throw new Error(`Error creating new workout: ${error.message}`);
    }
  }

  // GET a Workout by ID

  public static async getById(uuid: string): Promise<Workout | undefined> {
    try {
      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workouts: Workout[] = storedWorkouts
        ? JSON.parse(storedWorkouts)
        : [];
      return workouts.find((w) => w.id === uuid);
    } catch (error) {
      throw new Error(`Error fetching workout by ID: ${error.message}`);
    }
  }

  // GET all Workouts
  public static async getAll(): Promise<Workout[]> {
    try {
      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      return storedWorkouts ? JSON.parse(storedWorkouts) : [];
    } catch (error) {
      throw new Error(`Error retrieving all workouts: ${error.message}`);
    }
  }

  // UPDATE Workout
  public static async update(
    uuid: string,
    updates: Partial<Workout>
  ): Promise<Workout | undefined> {
    try {
      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workouts: Workout[] = storedWorkouts
        ? JSON.parse(storedWorkouts)
        : [];
      const workoutIndex = workouts.findIndex((w) => w.id === uuid);
      if (workoutIndex === -1)
        throw new Error(`Workout with ID: ${uuid} not found.`);
      const updatedWorkout = { ...workouts[workoutIndex], ...updates };
      workouts[workoutIndex] = updatedWorkout;
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workouts));
      return updatedWorkout;
    } catch (error) {
      throw new Error(`Error updating workout: ${error.message}`);
    }
  }

  // DELETE Workout
  public static async delete(uuid: string): Promise<boolean> {
    try {
      const storedWorkouts = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workouts: Workout[] = storedWorkouts
        ? JSON.parse(storedWorkouts)
        : [];
      const workoutIndex = workouts.findIndex((w) => w.id === uuid);
      if (workoutIndex === -1)
        throw new Error(`Workout with ID: ${uuid} not found.`);
      workouts.splice(workoutIndex, 1);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(workouts));
      return true;
    } catch (error) {
      throw new Error(`Error deleting workout: ${error.message}`);
    }
  }
}
