import { MuscleGroup } from "../interfaces/MuscleGroup.interface";

let muscleGroups: MuscleGroup[] = [];

export class MuscleGroupService {
  // CREATE MuscleGroup
  public static create(muscleGroup: MuscleGroup): MuscleGroup {
    if (!muscleGroup || !muscleGroup.uuid) {
      throw new Error("MuscleGroup must have a valid uuid.");
    }
    muscleGroups.push(muscleGroup);
    return muscleGroup;
  }

  // GET a MuscleGroup by UUID
  public static getById(uuid: string): MuscleGroup | undefined {
    const muscleGroup = muscleGroups.find((mg) => mg.uuid === uuid);
    if (!muscleGroup) {
      throw new Error(`MuscleGroup with UUID: ${uuid} not found.`);
    }
    return muscleGroup;
  }

  // GET all MuscleGroups
  public static getAll(): MuscleGroup[] {
    return muscleGroups;
  }

  // UPDATE/PATCH a MuscleGroup by UUID
  public static update(uuid: string, updates: Partial<MuscleGroup>): MuscleGroup | undefined {
    const muscleGroupIndex = muscleGroups.findIndex((mg) => mg.uuid === uuid);
    if (muscleGroupIndex === -1) {
      throw new Error(`MuscleGroup with UUID: ${uuid} not found.`);
    }

    if (updates.uuid && updates.uuid !== uuid) {
      throw new Error("Cannot change the UUID of a muscle group.");
    }

    muscleGroups[muscleGroupIndex] = { ...muscleGroups[muscleGroupIndex], ...updates };
    return muscleGroups[muscleGroupIndex];
  }

  // DELETE a MuscleGroup by UUID
  public static delete(uuid: string): boolean {
    const muscleGroupIndex = muscleGroups.findIndex((mg) => mg.uuid === uuid);
    if (muscleGroupIndex === -1) {
      throw new Error(`MuscleGroup with UUID: ${uuid} not found.`);
    }
    muscleGroups.splice(muscleGroupIndex, 1);
    return true;
  }
}
