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

      // Check for duplicates by exerciseId and setIndex
      // const isDuplicate = sets.some(
      //   (set) =>
      //     set.exerciseId === setData.exerciseId &&
      //     set.setIndex === setData.setIndex
      // );

      // if (isDuplicate) {
      //   throw new Error(
      //     `A set for exercise "${setData.exerciseId}" at index ${setData.setIndex} already exists.`
      //   );
      // }

      sets.push(newSet);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets));
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
    uuid: string,
    updates: Partial<Set>
  ): Promise<Set | undefined> {
    try {
      const storedSets = await AsyncStorage.getItem(this.STORAGE_KEY);
      const sets: Set[] = storedSets ? JSON.parse(storedSets) : [];
      const setIndex = sets.findIndex((s) => s.id === uuid);

      if (setIndex === -1) {
        throw new Error(`Set with ID: ${uuid} not found.`);
      }

      const updatedSet = { ...sets[setIndex], ...updates };
      sets[setIndex] = updatedSet;
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets));
      return updatedSet;
    } catch (error) {
      throw new Error(`Error updating set: ${error.message}`);
    }
  }

  // DELETE Set
  public static async delete(uuid: string): Promise<boolean> {
    try {
      const storedSets = await AsyncStorage.getItem(this.STORAGE_KEY);
      const sets: Set[] = storedSets ? JSON.parse(storedSets) : [];
      const setIndex = sets.findIndex((s) => s.id === uuid);

      if (setIndex === -1) {
        throw new Error(`Set with ID: ${uuid} not found.`);
      }

      sets.splice(setIndex, 1);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(sets));
      return true;
    } catch (error) {
      throw new Error(`Error deleting set: ${error.message}`);
    }
  }
}
