import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

import { MuscleGroup } from "../interfaces/MuscleGroup.interface";

export class MuscleGroupService {
  private static readonly STORAGE_KEY = "muscleGroups";

  // CREATE MuscleGroup
  public static async create(
    muscleGroupData: Omit<MuscleGroup, "id">
  ): Promise<MuscleGroup> {
    if (!muscleGroupData) {
      throw new Error("MuscleGroup data is required.");
    }

    try {
      const newMuscleGroup: MuscleGroup = {
        id: uuidv4(), // Generate UUID
        ...muscleGroupData,
      };

      // Retrieve existing muscle groups from AsyncStorage
      const storedMuscleGroups = await AsyncStorage.getItem(this.STORAGE_KEY);
      const muscleGroups: MuscleGroup[] = storedMuscleGroups
        ? JSON.parse(storedMuscleGroups)
        : [];

      // Add the new muscle group
      muscleGroups.push(newMuscleGroup);

      // Save back to AsyncStorage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(muscleGroups)
      );

      return newMuscleGroup;
    } catch (error) {
      throw new Error("Error creating new MuscleGroup: " + error.message);
    }
  }

  // GET a MuscleGroup by UUID
  public static async getById(uuid: string): Promise<MuscleGroup | undefined> {
    if (!uuid) {
      throw new Error("UUID is required.");
    }

    try {
      // Retrieve muscle groups from AsyncStorage
      const storedMuscleGroups = await AsyncStorage.getItem(this.STORAGE_KEY);
      const muscleGroups: MuscleGroup[] = storedMuscleGroups
        ? JSON.parse(storedMuscleGroups)
        : [];

      // Find the muscle group by UUID
      const muscleGroup = muscleGroups.find((mg) => mg.id === uuid);
      if (!muscleGroup) {
        throw new Error(`MuscleGroup with UUID: ${uuid} not found.`);
      }

      return muscleGroup;
    } catch (error) {
      throw new Error("Error retrieving MuscleGroup: " + error.message);
    }
  }

  // GET all MuscleGroups
  public static async getAll(): Promise<MuscleGroup[]> {
    try {
      // Retrieve all muscle groups from AsyncStorage
      const storedMuscleGroups = await AsyncStorage.getItem(this.STORAGE_KEY);
      const muscleGroups: MuscleGroup[] = storedMuscleGroups
        ? JSON.parse(storedMuscleGroups)
        : [];

      return muscleGroups;
    } catch (error) {
      throw new Error("Error retrieving all MuscleGroups: " + error.message);
    }
  }

  // UPDATE/PATCH a MuscleGroup by UUID
  public static async update(
    uuid: string,
    updates: Partial<MuscleGroup>
  ): Promise<MuscleGroup | undefined> {
    if (!uuid) {
      throw new Error("UUID is required for updating a muscle group.");
    }

    try {
      // Retrieve existing muscle groups from AsyncStorage
      const storedMuscleGroups = await AsyncStorage.getItem(this.STORAGE_KEY);
      const muscleGroups: MuscleGroup[] = storedMuscleGroups
        ? JSON.parse(storedMuscleGroups)
        : [];

      // Find the muscle group to update
      const muscleGroupIndex = muscleGroups.findIndex((mg) => mg.id === uuid);
      if (muscleGroupIndex === -1) {
        throw new Error(`MuscleGroup with UUID: ${uuid} not found.`);
      }

      // Merge updates into the muscle group
      const updatedMuscleGroup = {
        ...muscleGroups[muscleGroupIndex],
        ...updates,
      };

      // Update the muscle group in the list
      muscleGroups[muscleGroupIndex] = updatedMuscleGroup;

      // Save updated muscle groups back to AsyncStorage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(muscleGroups)
      );

      return updatedMuscleGroup;
    } catch (error) {
      throw new Error("Error updating MuscleGroup: " + error.message);
    }
  }

  // DELETE a MuscleGroup by UUID
  public static async delete(uuid: string): Promise<boolean> {
    if (!uuid) {
      throw new Error("UUID is required for deleting a muscle group.");
    }

    try {
      // Retrieve existing muscle groups from AsyncStorage
      const storedMuscleGroups = await AsyncStorage.getItem(this.STORAGE_KEY);
      const muscleGroups: MuscleGroup[] = storedMuscleGroups
        ? JSON.parse(storedMuscleGroups)
        : [];

      // Find the muscle group to delete
      const muscleGroupIndex = muscleGroups.findIndex((mg) => mg.id === uuid);
      if (muscleGroupIndex === -1) {
        throw new Error(`MuscleGroup with UUID: ${uuid} not found.`);
      }

      // Remove the muscle group from the array
      muscleGroups.splice(muscleGroupIndex, 1);

      // Save updated muscle groups back to AsyncStorage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(muscleGroups)
      );

      return true;
    } catch (error) {
      throw new Error("Error deleting MuscleGroup: " + error.message);
    }
  }
}
