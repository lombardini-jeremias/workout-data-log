import { Equipment } from "../interfaces/Equipment.interface";

let equipmentList: Equipment[] = [];

export class EquipmentService {
  // CREATE Equipment
  public static create(equipment: Equipment): Equipment {
    if (!equipment || !equipment.uuid) {
      throw new Error("Equipment must have a valid uuid.");
    }
    equipmentList.push(equipment);
    return equipment;
  }

  // GET an Equipment by UUID
  public static getById(uuid: string): Equipment | undefined {
    const equipment = equipmentList.find((e) => e.uuid === uuid);
    if (!equipment) {
      throw new Error(`Equipment with UUID: ${uuid} not found.`);
    }
    return equipment;
  }

  // GET all Equipment
  public static getAll(): Equipment[] {
    return equipmentList;
  }

  // UPDATE/PATCH an Equipment by UUID
  public static update(uuid: string, updates: Partial<Equipment>): Equipment | undefined {
    const equipmentIndex = equipmentList.findIndex((e) => e.uuid === uuid);
    if (equipmentIndex === -1) {
      throw new Error(`Equipment with UUID: ${uuid} not found.`);
    }

    if (updates.uuid && updates.uuid !== uuid) {
      throw new Error("Cannot change the UUID of the equipment.");
    }

    equipmentList[equipmentIndex] = { ...equipmentList[equipmentIndex], ...updates };
    return equipmentList[equipmentIndex];
  }

  // DELETE an Equipment by UUID
  public static delete(uuid: string): boolean {
    const equipmentIndex = equipmentList.findIndex((e) => e.uuid === uuid);
    if (equipmentIndex === -1) {
      throw new Error(`Equipment with UUID: ${uuid} not found.`);
    }
    equipmentList.splice(equipmentIndex, 1);
    return true;
  }
}
