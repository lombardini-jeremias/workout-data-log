import { EquipmentService } from "./Equipment.service";
import { EquipmentType } from "../interfaces/Equipment.interface";
import { MuscleGroupService } from "./MuscleGroup.service";
import { MuscleGroupCategory } from "../interfaces/MuscleGroup.interface";
import { ExerciseTypeService } from "./ExerciseType.service";
import { ExerciseTypeCategory } from "../interfaces/ExerciseType.interface";

// Preload Equipment Data
export const preloadEquipment = async () => {
  try {
    const equipmentData = await EquipmentService.getAll();
    if (equipmentData.length === 0) {
      await EquipmentService.create({
        name: "None",
        equipmentType: EquipmentType.BODYWEIGHT,
      });
      await EquipmentService.create({
        name: "Barbell",
        equipmentType: EquipmentType.WEIGHT,
      });
      await EquipmentService.create({
        name: "Dumbbell",
        equipmentType: EquipmentType.WEIGHT,
      });
      await EquipmentService.create({
        name: "Kettlebell",
        equipmentType: EquipmentType.WEIGHT,
      });
      await EquipmentService.create({
        name: "Machine",
        equipmentType: EquipmentType.MACHINE,
      });
      await EquipmentService.create({
        name: "Plate",
        equipmentType: EquipmentType.WEIGHT,
      });
      await EquipmentService.create({
        name: "Weigthed Ball",
        equipmentType: EquipmentType.WEIGHT,
      });
      await EquipmentService.create({
        name: "Resistance Band",
        equipmentType: EquipmentType.RESISTANCE,
      });
      await EquipmentService.create({
        name: "Suspension Band",
        equipmentType: EquipmentType.RESISTANCE,
      });
      await EquipmentService.create({
        name: "Exercise Ball",
        equipmentType: EquipmentType.SPECIALIZED,
      });
      await EquipmentService.create({
        name: "Skipping Rope",
        equipmentType: EquipmentType.SPECIALIZED,
      });
    }
  } catch (error) {
    console.error("Error preloading equipment data: ", error);
  }
};

// Preload Muscle Group Data
export const preloadMuscleGroups = async () => {
  try {
    const muscleGroupData = await MuscleGroupService.getAll();
    if (muscleGroupData.length === 0) {
      await MuscleGroupService.create({
        name: "Abdominals",
        category: MuscleGroupCategory.CORE,
      });
      await MuscleGroupService.create({
        name: "Abductors",
        category: MuscleGroupCategory.LEGS,
      });
      await MuscleGroupService.create({
        name: "Adductors",
        category: MuscleGroupCategory.LEGS,
      });
      await MuscleGroupService.create({
        name: "Biceps",
        category: MuscleGroupCategory.ARMS,
      });
      await MuscleGroupService.create({
        name: "Calves",
        category: MuscleGroupCategory.LEGS,
      });
      await MuscleGroupService.create({
        name: "Cardio",
        category: MuscleGroupCategory.CARDIO,
      });
      await MuscleGroupService.create({
        name: "Chest",
        category: MuscleGroupCategory.CHEST,
      });
      await MuscleGroupService.create({
        name: "Forearms",
        category: MuscleGroupCategory.ARMS,
      });
      await MuscleGroupService.create({
        name: "Full Body",
        category: MuscleGroupCategory.FULL_BODY,
      });
      await MuscleGroupService.create({
        name: "Glutes",
        category: MuscleGroupCategory.LEGS,
      });
      await MuscleGroupService.create({
        name: "Hamstrings",
        category: MuscleGroupCategory.LEGS,
      });
      await MuscleGroupService.create({
        name: "Lats",
        category: MuscleGroupCategory.BACK,
      });
      await MuscleGroupService.create({
        name: "Lower Back",
        category: MuscleGroupCategory.BACK,
      });
      await MuscleGroupService.create({
        name: "Neck",
        category: MuscleGroupCategory.SHOULDERS,
      });
      await MuscleGroupService.create({
        name: "Quadriceps",
        category: MuscleGroupCategory.LEGS,
      });
      await MuscleGroupService.create({
        name: "Shoulders",
        category: MuscleGroupCategory.SHOULDERS,
      });
      await MuscleGroupService.create({
        name: "Traps",
        category: MuscleGroupCategory.BACK,
      });
      await MuscleGroupService.create({
        name: "Triceps",
        category: MuscleGroupCategory.ARMS,
      });
      await MuscleGroupService.create({
        name: "Upper Back",
        category: MuscleGroupCategory.BACK,
      });
    }
  } catch (error) {
    console.error("Error preloading muscle group data: ", error);
  }
};

// Preload Exercise Type Data
export const preloadExerciseTypes = async () => {
  try {
    const exerciseTypeData = await ExerciseTypeService.getAll();
    if (exerciseTypeData.length === 0) {
      await ExerciseTypeService.create({
        type: ExerciseTypeCategory.ASSISTED_BODYWEIGHT,
      });
      await ExerciseTypeService.create({
        type: ExerciseTypeCategory.BODYWEIGHT_REPS,
      });
      await ExerciseTypeService.create({
        type: ExerciseTypeCategory.BODYWEIGHT_WEIGHTED,
      });
      await ExerciseTypeService.create({
        type: ExerciseTypeCategory.DISTANCE_DURATION,
      });
      await ExerciseTypeService.create({ type: ExerciseTypeCategory.DURATION });
      await ExerciseTypeService.create({
        type: ExerciseTypeCategory.DURATION_WEIGHT,
      });
      await ExerciseTypeService.create({
        type: ExerciseTypeCategory.WEIGHTED_REPS,
      });
      await ExerciseTypeService.create({
        type: ExerciseTypeCategory.WEIGHT_DISTANCE,
      });
    }
  } catch (error) {
    console.error("Error preloading exercise type data: ", error);
  }
};

// Preload all necessary data
export const preloadAllDataService = async () => {
  await preloadEquipment();
  await preloadMuscleGroups();
  await preloadExerciseTypes();
};
