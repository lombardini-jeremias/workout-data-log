import { ExerciseType } from "../interfaces/ExerciseType.interface";

let exerciseTypes: ExerciseType[] = [];

export class ExerciseTypeService {
  // CREATE ExerciseType
  public static create(exerciseType: ExerciseType): ExerciseType {
    if (!exerciseType || !exerciseType.uuid) {
      throw new Error("ExerciseType must have a valid uuid.");
    }
    exerciseTypes.push(exerciseType);
    return exerciseType;
  }

  // GET an ExerciseType by UUID
  public static getById(uuid: string): ExerciseType | undefined {
    const exerciseType = exerciseTypes.find((et) => et.uuid === uuid);
    if (!exerciseType) {
      throw new Error(`ExerciseType with UUID: ${uuid} not found.`);
    }
    return exerciseType;
  }

  // GET all ExerciseTypes
  public static getAll(): ExerciseType[] {
    return exerciseTypes;
  }

  // UPDATE/PATCH an ExerciseType by UUID
  public static update(uuid: string, updates: Partial<ExerciseType>): ExerciseType | undefined {
    const exerciseTypeIndex = exerciseTypes.findIndex((et) => et.uuid === uuid);
    if (exerciseTypeIndex === -1) {
      throw new Error(`ExerciseType with UUID: ${uuid} not found.`);
    }

    if (updates.uuid && updates.uuid !== uuid) {
      throw new Error("Cannot change the UUID of an exercise type.");
    }

    exerciseTypes[exerciseTypeIndex] = { ...exerciseTypes[exerciseTypeIndex], ...updates };
    return exerciseTypes[exerciseTypeIndex];
  }

  // DELETE an ExerciseType by UUID
  public static delete(uuid: string): boolean {
    const exerciseTypeIndex = exerciseTypes.findIndex((et) => et.uuid === uuid);
    if (exerciseTypeIndex === -1) {
      throw new Error(`ExerciseType with UUID: ${uuid} not found.`);
    }
    exerciseTypes.splice(exerciseTypeIndex, 1);
    return true;
  }
}
