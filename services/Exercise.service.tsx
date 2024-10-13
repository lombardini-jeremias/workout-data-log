import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { Exercise } from "../interfaces/Exercise.interface";

export class ExerciseService {
  private static readonly STORAGE_KEY = "personalExercises";

  // CREATE Exercise
  public static async create(
    exerciseData: Omit<Exercise, "id">
  ): Promise<Exercise> {
    if (!exerciseData) {
      throw new Error("Exercise data is missing.");
    }

    try {
      const newExercise: Exercise = {
        id: uuidv4(),
        ...exerciseData,
      };

      const storedExercises = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exercises: Exercise[] = storedExercises
        ? JSON.parse(storedExercises)
        : [];

      const isDuplicate = exercises.some(
        (exercise) =>
          exercise.name.toLowerCase() === exerciseData.name.toLowerCase()
      );
      if (isDuplicate) {
        throw new Error(
          `An exercise with the name "${exerciseData.name}" already exists.`
        );
      }

      exercises.push(newExercise);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(exercises));

      return newExercise;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error creating new Exercise: " + error.message);
      } else {
        throw new Error("Unknown error occurred while creating new Exercise.");
      }
    }
  }

  // GET an Exercise by UUID
  public static async getById(uuid: string): Promise<Exercise | undefined> {
    if (!uuid) {
      throw new Error("UUID is required.");
    }
    try {
      // Retrieve exercises from AsyncStorage
      const storedExercises = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exercises: Exercise[] = storedExercises
        ? JSON.parse(storedExercises)
        : [];

      // Find the exercise with the given UUID
      const exercise = exercises.find((e) => e.id === uuid);
      if (!exercise) {
        throw new Error(`Exercise with UUID: ${uuid} not found.`);
      }
      console.log("GET-BY-ID", exercise);
      return exercise;
    } catch (error) {
      throw new Error("Error retrieving exercise: " + error.message);
    }
  }

  // GET all Exercises
  public static async getAll(): Promise<Exercise[]> {
    try {
      const storedExercises = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exercises: Exercise[] = storedExercises
        ? JSON.parse(storedExercises)
        : [];

      return exercises;
    } catch (error) {
      throw new Error("Error retrieving all exercises: " + error.message);
    }
  }

  // UPDATE/PATCH an Exercise by UUID
  public static async update(
    uuid: string,
    updates: Partial<Exercise>
  ): Promise<Exercise | undefined> {
    if (!uuid) {
      throw new Error("UUID is required for updating an exercise.");
    }
    try {
      const storedExercises = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exercises: Exercise[] = storedExercises
        ? JSON.parse(storedExercises)
        : [];

      // Find the exercise to update
      const exerciseIndex = exercises.findIndex((e) => e.id === uuid);
      if (exerciseIndex === -1) {
        throw new Error(`Exercise with UUID: ${uuid} not found.`);
      }

      // Merge updates into the exercise
      const updatedExercise = { ...exercises[exerciseIndex], ...updates };
      // Update the exercise in the list
      exercises[exerciseIndex] = updatedExercise;
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(exercises));

      return updatedExercise;
    } catch (error) {
      throw new Error("Error updating exercise: " + error.message);
    }
  }

  // DELETE an Exercise by UUID
  public static async delete(uuid: string): Promise<boolean> {
    if (!uuid) {
      throw new Error("UUID is required for deleting an exercise.");
    }
    try {
      const storedExercises = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exercises: Exercise[] = storedExercises
        ? JSON.parse(storedExercises)
        : [];

      // Find the exercise to delete
      const exerciseIndex = exercises.findIndex((e) => e.id === uuid);
      if (exerciseIndex === -1) {
        throw new Error(`Exercise with UUID: ${uuid} not found.`);
      }

      // Remove the exercise from the array
      exercises.splice(exerciseIndex, 1);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(exercises));

      return true;
    } catch (error) {
      throw new Error("Error deleting exercise: " + error.message);
    }
  }
}
