import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { ExercisePlan } from "../interfaces/ExercisePlan.interface";

export class ExercisePlanService {
  private static readonly STORAGE_KEY = "exercisePlans";

  // CREATE ExercisePlan
  public static async create(
    exercisePlanData: Omit<ExercisePlan, "id">
  ): Promise<ExercisePlan> {
    if (!exercisePlanData) {
      throw new Error("Exercise plan data is missing.");
    }

    try {
      const newExercisePlan: ExercisePlan = {
        id: uuidv4(),
        ...exercisePlanData,
      };

      const storedPlans = await AsyncStorage.getItem(this.STORAGE_KEY);
      const plans: ExercisePlan[] = storedPlans ? JSON.parse(storedPlans) : [];

      plans.push(newExercisePlan);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans));

      return newExercisePlan;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Error creating new Exercise Plan: " + error.message);
      } else {
        throw new Error(
          "Unknown error occurred while creating new Exercise Plan."
        );
      }
    }
  }

  // GET an ExercisePlan by UUID
  public static async getById(uuid: string): Promise<ExercisePlan | undefined> {
    if (!uuid) {
      throw new Error("UUID is required.");
    }
    try {
      const storedPlans = await AsyncStorage.getItem(this.STORAGE_KEY);
      const plans: ExercisePlan[] = storedPlans ? JSON.parse(storedPlans) : [];

      const plan = plans.find((p) => p.id === uuid);
      if (!plan) {
        throw new Error(`Exercise Plan with UUID: ${uuid} not found.`);
      }

      return plan;
    } catch (error) {
      throw new Error("Error retrieving exercise plan: " + error.message);
    }
  }

  // GET all ExercisePlans
  public static async getAll(): Promise<ExercisePlan[]> {
    try {
      const storedPlans = await AsyncStorage.getItem(this.STORAGE_KEY);
      const plans: ExercisePlan[] = storedPlans ? JSON.parse(storedPlans) : [];

      return plans;
    } catch (error) {
      throw new Error("Error retrieving all exercise plans: " + error.message);
    }
  }

  // UPDATE an ExercisePlan by UUID
  public static async update(
    uuid: string,
    updates: Partial<ExercisePlan>
  ): Promise<ExercisePlan | undefined> {
    if (!uuid) {
      throw new Error("UUID is required for updating an exercise plan.");
    }
    try {
      const storedPlans = await AsyncStorage.getItem(this.STORAGE_KEY);
      const plans: ExercisePlan[] = storedPlans ? JSON.parse(storedPlans) : [];

      const planIndex = plans.findIndex((p) => p.id === uuid);
      if (planIndex === -1) {
        throw new Error(`Exercise Plan with UUID: ${uuid} not found.`);
      }

      const updatedPlan = { ...plans[planIndex], ...updates };
      plans[planIndex] = updatedPlan;
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans));

      return updatedPlan;
    } catch (error) {
      throw new Error("Error updating exercise plan: " + error.message);
    }
  }

  // DELETE an ExercisePlan by UUID
  public static async delete(uuid: string): Promise<boolean> {
    if (!uuid) {
      throw new Error("UUID is required for deleting an exercise plan.");
    }
    try {
      const storedPlans = await AsyncStorage.getItem(this.STORAGE_KEY);
      const plans: ExercisePlan[] = storedPlans ? JSON.parse(storedPlans) : [];

      const planIndex = plans.findIndex((p) => p.id === uuid);
      if (planIndex === -1) {
        throw new Error(`Exercise Plan with UUID: ${uuid} not found.`);
      }

      plans.splice(planIndex, 1);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(plans));

      return true;
    } catch (error) {
      throw new Error("Error deleting exercise plan: " + error.message);
    }
  }
}
