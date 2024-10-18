import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Set } from "../interfaces/Set.interface";

export class SetService {
  private static readonly STORAGE_KEY = "sets";

  // CREATE Set
  public static async create(setData: Omit<Set, "id">): Promise<Set> {
    try {
      const newSet: Set = {
        id: uuidv4(),
        ...setData,
      };

      const storedSets = await AsyncStorage.getItem(this.STORAGE_KEY);
      const sets: Set[] = storedSets ? JSON.parse(storedSets) : [];
      sets.push(newSet);

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets));

      console.log("CREATE-SET", newSet);
      return newSet;
    } catch (error) {
      throw new Error(`Error creating new set: ${error.message}`);
    }
  }

  // GET a Set by ID
  public static async getById(uuid: string): Promise<Set | undefined> {
    try {
      const storedSets = await AsyncStorage.getItem(this.STORAGE_KEY);
      const sets: Set[] = storedSets ? JSON.parse(storedSets) : [];
      return sets.find((s) => s.id === uuid);
    } catch (error) {
      throw new Error(`Error fetching set by ID: ${error.message}`);
    }
  }

  // GET all Sets
  public static async getAll(): Promise<Set[]> {
    try {
      const storedSets = await AsyncStorage.getItem(this.STORAGE_KEY);
      return storedSets ? JSON.parse(storedSets) : [];
    } catch (error) {
      throw new Error(`Error retrieving all sets: ${error.message}`);
    }
  }

  // UPDATE Set
  public static async update(
    setId: string,
    updates: Partial<Set>
  ): Promise<Set | undefined> {
    console.log("SET-SERVICE-UPDATE-EXECUTED");
    try {
      const storedSets = await AsyncStorage.getItem(this.STORAGE_KEY);
      const sets: Set[] = storedSets ? JSON.parse(storedSets) : [];
      const existingSetIndex = sets.findIndex((s) => s.id === setId);

      if (existingSetIndex === -1) {
        throw new Error(`Set with ID: ${setId} not found.`);
      }

      // Merge existing set data with updates
      const updatedSet = { ...sets[existingSetIndex], ...updates };
      sets[existingSetIndex] = updatedSet; // Update the set in the array

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets)); // Save updated sets

      console.log("SET-SERVICE-UPDATED-END", updatedSet);
      return updatedSet;
    } catch (error) {
      throw new Error(`Error updating set: ${error.message}`);
    }
  }

  // DELETE Set
  public static async delete(setId: string): Promise<boolean> {
    try {
      const storedSets = await AsyncStorage.getItem(this.STORAGE_KEY);
      const sets: Set[] = storedSets ? JSON.parse(storedSets) : [];
      const existingSetIndex = sets.findIndex((s) => s.id === setId);

      if (existingSetIndex === -1) {
        throw new Error(`Set with ID: ${setId} not found.`);
      }

      sets.splice(existingSetIndex, 1); // Remove the set from the array

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets)); // Save updated sets

      return true;
    } catch (error) {
      throw new Error(`Error deleting set: ${error.message}`);
    }
  }
}
