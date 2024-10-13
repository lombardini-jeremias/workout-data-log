import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

import { ExerciseType } from "../interfaces/ExerciseType.interface";

export class ExerciseTypeService {
  private static readonly STORAGE_KEY = "exerciseTypes";

  // CREATE ExerciseType
  public static async create(
    exerciseTypeData: Omit<ExerciseType, "id">
  ): Promise<ExerciseType> {
    if (!exerciseTypeData) {
      throw new Error("ExerciseType data is missing.");
    }

    try {
      const newExerciseType: ExerciseType = {
        id: uuidv4(),
        ...exerciseTypeData,
      };

      // Retrieve existing exercise types from AsyncStorage
      const storedExerciseTypes = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exerciseTypes: ExerciseType[] = storedExerciseTypes
        ? JSON.parse(storedExerciseTypes)
        : [];

      // Add the new exercise type
      exerciseTypes.push(newExerciseType);

      // Save back to AsyncStorage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(exerciseTypes)
      );

      return newExerciseType;
    } catch (error) {
      throw new Error("Error creating new ExerciseType: " + error.message);
    }
  }

  // GET an ExerciseType by UUID
  public static async getById(uuid: string): Promise<ExerciseType | undefined> {
    if (!uuid) {
      throw new Error("UUID is required.");
    }

    try {
      // Retrieve exercise types from AsyncStorage
      const storedExerciseTypes = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exerciseTypes: ExerciseType[] = storedExerciseTypes
        ? JSON.parse(storedExerciseTypes)
        : [];

      // Find the exercise type with the given UUID
      const exerciseType = exerciseTypes.find((et) => et.id === uuid);
      if (!exerciseType) {
        throw new Error(`ExerciseType with UUID: ${uuid} not found.`);
      }

      return exerciseType;
    } catch (error) {
      throw new Error("Error retrieving exercise type: " + error.message);
    }
  }

  // GET all ExerciseTypes
  public static async getAll(): Promise<ExerciseType[]> {
    try {
      // Retrieve exercise types from AsyncStorage
      const storedExerciseTypes = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exerciseTypes: ExerciseType[] = storedExerciseTypes
        ? JSON.parse(storedExerciseTypes)
        : [];

      return exerciseTypes;
    } catch (error) {
      throw new Error("Error retrieving all exercise types: " + error.message);
    }
  }

  // UPDATE/PATCH an ExerciseType by UUID
  public static async update(
    uuid: string,
    updates: Partial<ExerciseType>
  ): Promise<ExerciseType | undefined> {
    if (!uuid) {
      throw new Error("UUID is required for updating an exercise type.");
    }

    try {
      // Retrieve existing exercise types from AsyncStorage
      const storedExerciseTypes = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exerciseTypes: ExerciseType[] = storedExerciseTypes
        ? JSON.parse(storedExerciseTypes)
        : [];

      // Find the exercise type to update
      const exerciseTypeIndex = exerciseTypes.findIndex((et) => et.id === uuid);
      if (exerciseTypeIndex === -1) {
        throw new Error(`ExerciseType with UUID: ${uuid} not found.`);
      }

      // Merge updates into the exercise type
      const updatedExerciseType = {
        ...exerciseTypes[exerciseTypeIndex],
        ...updates,
      };

      // Update the exercise type in the list
      exerciseTypes[exerciseTypeIndex] = updatedExerciseType;

      // Save updated exercise types list back to AsyncStorage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(exerciseTypes)
      );

      return updatedExerciseType;
    } catch (error) {
      throw new Error("Error updating exercise type: " + error.message);
    }
  }

  // DELETE an ExerciseType by UUID
  public static async delete(uuid: string): Promise<boolean> {
    if (!uuid) {
      throw new Error("UUID is required for deleting an exercise type.");
    }

    try {
      // Retrieve existing exercise types from AsyncStorage
      const storedExerciseTypes = await AsyncStorage.getItem(this.STORAGE_KEY);
      const exerciseTypes: ExerciseType[] = storedExerciseTypes
        ? JSON.parse(storedExerciseTypes)
        : [];

      // Find the exercise type to delete
      const exerciseTypeIndex = exerciseTypes.findIndex((et) => et.id === uuid);
      if (exerciseTypeIndex === -1) {
        throw new Error(`ExerciseType with UUID: ${uuid} not found.`);
      }

      // Remove the exercise type from the array
      exerciseTypes.splice(exerciseTypeIndex, 1);

      // Save updated exercise types list back to AsyncStorage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(exerciseTypes)
      );

      return true;
    } catch (error) {
      throw new Error("Error deleting exercise type: " + error.message);
    }
  }
}
