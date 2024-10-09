import { Exercise } from "../interfaces/Exercise.interface";
import { v4 as uuidv4 } from 'uuid';

let exercises: Exercise[] = [];

export class ExerciseService {
  // CREATE Exercise
  public static create(exercise: Exercise): Exercise {
    if (!exercise) {
      throw new Error("Exercise must have a valid uuid.");
    }
    try {
      const newExercise: Exercise = {
        ...exercise,
        uuid: uuidv4()
      };
    } catch (error) {
      
    }
    exercises.push(exercise);
    return exercise;
  }

  // GET an Exercise by UUID
  public static getById(uuid: string): Exercise | undefined {
    const exercise = exercises.find((exercise) => exercise.uuid === uuid);
    if (!exercise) {
      throw new Error(`Exercise with UUID: ${uuid} not found.`);
    }
    return exercise;
  }

  // GET all Exercises
  public static getAll(): Exercise[] {
    return exercises;
  }

  // UPDATE/PATCH an Exercise by UUID
  public static update(uuid: string, updates: Partial<Exercise>): Exercise | undefined {
    const exerciseIndex = exercises.findIndex((exercise) => exercise.uuid === uuid);
    if (exerciseIndex === -1) {
      throw new Error(`Exercise with UUID: ${uuid} not found.`);
    }

    if (updates.uuid && updates.uuid !== uuid) {
      throw new Error("Cannot change the UUID of an exercise.");
    }

    exercises[exerciseIndex] = { ...exercises[exerciseIndex], ...updates };
    return exercises[exerciseIndex];
  }

  // DELETE an Exercise by UUID
  public static delete(uuid: string): boolean {
    const exerciseIndex = exercises.findIndex((exercise) => exercise.uuid === uuid);
    if (exerciseIndex === -1) {
      throw new Error(`Exercise with UUID: ${uuid} not found.`);
    }
    exercises.splice(exerciseIndex, 1);
    return true;
  }
}
