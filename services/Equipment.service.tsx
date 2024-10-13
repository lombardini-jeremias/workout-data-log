import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { Equipment } from "../interfaces/Equipment.interface";

export class EquipmentService {
  private static readonly STORAGE_KEY = "equipmentList";

  // CREATE Equipment
  public static async create(
    equipmentData: Omit<Equipment, "id">
  ): Promise<Equipment> {
    if (!equipmentData) {
      throw new Error("Equipment data is required.");
    }

    try {
      const newEquipment: Equipment = {
        id: uuidv4(), // Generate a new UUID
        ...equipmentData,
      };

      // Retrieve the current equipment list from AsyncStorage
      const storedEquipment = await AsyncStorage.getItem(this.STORAGE_KEY);
      const equipmentList: Equipment[] = storedEquipment
        ? JSON.parse(storedEquipment)
        : [];

      // Add the new equipment
      equipmentList.push(newEquipment);

      // Save the updated equipment list to AsyncStorage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(equipmentList)
      );

      return newEquipment;
    } catch (error) {
      throw new Error("Error creating new Equipment: " + error.message);
    }
  }

  // GET an Equipment by UUID
  public static async getById(uuid: string): Promise<Equipment | undefined> {
    if (!uuid) {
      throw new Error("UUID is required.");
    }

    try {
      // Retrieve equipment list from AsyncStorage
      const storedEquipment = await AsyncStorage.getItem(this.STORAGE_KEY);
      const equipmentList: Equipment[] = storedEquipment
        ? JSON.parse(storedEquipment)
        : [];

      // Find the equipment by UUID
      const equipment = equipmentList.find((e) => e.id === uuid);
      if (!equipment) {
        throw new Error(`Equipment with UUID: ${uuid} not found.`);
      }

      return equipment;
    } catch (error) {
      throw new Error("Error retrieving Equipment: " + error.message);
    }
  }

  // GET all Equipment
  public static async getAll(): Promise<Equipment[]> {
    try {
      // Retrieve all equipment from AsyncStorage
      const storedEquipment = await AsyncStorage.getItem(this.STORAGE_KEY);
      const equipmentList: Equipment[] = storedEquipment
        ? JSON.parse(storedEquipment)
        : [];

      return equipmentList;
    } catch (error) {
      throw new Error("Error retrieving all Equipment: " + error.message);
    }
  }

  // UPDATE/PATCH an Equipment by UUID
  public static async update(
    uuid: string,
    updates: Partial<Equipment>
  ): Promise<Equipment | undefined> {
    if (!uuid) {
      throw new Error("UUID is required for updating equipment.");
    }

    try {
      // Retrieve current equipment list from AsyncStorage
      const storedEquipment = await AsyncStorage.getItem(this.STORAGE_KEY);
      const equipmentList: Equipment[] = storedEquipment
        ? JSON.parse(storedEquipment)
        : [];

      // Find the equipment to update
      const equipmentIndex = equipmentList.findIndex((e) => e.id === uuid);
      if (equipmentIndex === -1) {
        throw new Error(`Equipment with UUID: ${uuid} not found.`);
      }

      // Merge updates into the existing equipment
      const updatedEquipment = { ...equipmentList[equipmentIndex], ...updates };

      // Update the equipment in the list
      equipmentList[equipmentIndex] = updatedEquipment;

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(equipmentList)
      );

      return updatedEquipment;
    } catch (error) {
      throw new Error("Error updating Equipment: " + error.message);
    }
  }

  // DELETE an Equipment by UUID
  public static async delete(uuid: string): Promise<boolean> {
    if (!uuid) {
      throw new Error("UUID is required for deleting equipment.");
    }

    try {
      // Retrieve current equipment list from AsyncStorage
      const storedEquipment = await AsyncStorage.getItem(this.STORAGE_KEY);
      const equipmentList: Equipment[] = storedEquipment
        ? JSON.parse(storedEquipment)
        : [];

      // Find the equipment to delete
      const equipmentIndex = equipmentList.findIndex((e) => e.id === uuid);
      if (equipmentIndex === -1) {
        throw new Error(`Equipment with UUID: ${uuid} not found.`);
      }

      // Remove the equipment from the array
      equipmentList.splice(equipmentIndex, 1);

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(equipmentList)
      );

      return true;
    } catch (error) {
      throw new Error("Error deleting Equipment: " + error.message);
    }
  }
}
