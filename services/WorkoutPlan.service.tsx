import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
import { WorkoutPlan } from "../interfaces/WorkoutPlan.interface";

export class WorkoutPlanService {
  private static readonly STORAGE_KEY = "workoutPlans";

  // CREATE Workout Plan
  public static async create(
    workoutPlanData: Omit<WorkoutPlan, "id">
  ): Promise<WorkoutPlan> {
    try {
      const newWorkoutPlan: WorkoutPlan = {
        id: uuidv4(),
        ...workoutPlanData,
      };

      const storedWorkoutPlans = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workoutPlans: WorkoutPlan[] = storedWorkoutPlans
        ? JSON.parse(storedWorkoutPlans)
        : [];

      // Check for duplicates by workoutId and exerciseId
      // const isDuplicate = workoutPlans.some(
      //   (workoutPlan) =>
      //     workoutPlan.workoutId === workoutPlanData.workoutId &&
      //     workoutPlan.exerciseId === workoutPlanData.exerciseId
      // );

      // if (isDuplicate) {
      //   throw new Error(
      //     `A workout plan for workout ID "${workoutPlanData.workoutId}" and exercise ID "${workoutPlanData.exerciseId}" already exists.`
      //   );
      // }

      workoutPlans.push(newWorkoutPlan);
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(workoutPlans)
      );

      return newWorkoutPlan;
    } catch (error) {
      throw new Error(`Error creating new workout plan: ${error.message}`);
    }
  }

  // GET a Workout Plan by ID
  public static async getById(uuid: string): Promise<WorkoutPlan | undefined> {
    try {
      const storedWorkoutPlans = await AsyncStorage.getItem(this.STORAGE_KEY);
      const workoutPlans: WorkoutPlan[] = storedWorkoutPlans
        ? JSON.parse(storedWorkoutPlans)
        : [];
      return workoutPlans.find((wp) => wp.id === uuid);
    } catch (error) {
      throw new Error(`Error fetching workout plan by ID: ${error.message}`);
    }
  }

  // GET all Workout Plans
  public static async getAll(): Promise<WorkoutPlan[]> {
    try {
      const storedWorkoutPlans = await AsyncStorage.getItem(this.STORAGE_KEY);
      return storedWorkoutPlans ? JSON.parse(storedWorkoutPlans) : [];
    } catch (error) {
      throw new Error(`Error retrieving all workout plans: ${error.message}`);
    }
  }

  // UPDATE Workout Plan
  public static async update(
    workoutPlanId: string,
    updates: Partial<WorkoutPlan>
  ): Promise<WorkoutPlan | undefined> {
    console.log("UPDATE", workoutPlanId);
    try {
      // Fetch the existing workout plan using WorkoutPlanService
      const existingWorkoutPlan = await WorkoutPlanService.getById(
        workoutPlanId
      );
      if (!existingWorkoutPlan) {
        throw new Error(`Workout plan with ID: ${workoutPlanId} not found.`);
      }
      // Merge the updates with the existing workout plan
      const updatedWorkoutPlan = { ...existingWorkoutPlan, ...updates };
      await WorkoutPlanService.update(workoutPlanId, updatedWorkoutPlan);

      return updatedWorkoutPlan;
    } catch (error) {
      throw new Error(`Error updating workout plan: ${error.message}`);
    }
  }

  // public static async update(
  //   uuid: string,
  //   updates: Partial<WorkoutPlan>
  // ): Promise<WorkoutPlan | undefined> {
  //   try {
  //     const storedWorkoutPlans = await AsyncStorage.getItem(this.STORAGE_KEY);
  //     const workoutPlans: WorkoutPlan[] = storedWorkoutPlans
  //       ? JSON.parse(storedWorkoutPlans)
  //       : [];
  //     const workoutPlanIndex = workoutPlans.findIndex((wp) => wp.id === uuid);
  //     if (workoutPlanIndex === -1) {
  //       throw new Error(`Workout plan with ID: ${uuid} not found.`);
  //     }
  //     const updatedWorkoutPlan = {
  //       ...workoutPlans[workoutPlanIndex],
  //       ...updates,
  //     };
  //     workoutPlans[workoutPlanIndex] = updatedWorkoutPlan;
  //     await AsyncStorage.setItem(
  //       this.STORAGE_KEY,
  //       JSON.stringify(workoutPlans)
  //     );
  //     return updatedWorkoutPlan;
  //   } catch (error) {
  //     throw new Error(`Error updating workout plan: ${error.message}`);
  //   }
  // }

  // DELETE Workout Plan
  public static async delete(workoutPlanId: string): Promise<boolean> {
    try {
      const existingWorkoutPlan = await WorkoutPlanService.getById(
        workoutPlanId
      );
      if (!existingWorkoutPlan) {
        throw new Error(`Workout plan with ID: ${workoutPlanId} not found.`);
      }

      await WorkoutPlanService.delete(workoutPlanId);

      return true;
    } catch (error) {
      throw new Error(`Error deleting workout plan: ${error.message}`);
    }
  }
}
