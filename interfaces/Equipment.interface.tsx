export enum EquipmentType {
  WEIGHT = "weight",
  RESISTANCE = "resistance",
  CARDIO = "cardio",
  BODYWEIGHT = "bodyweight",
  MACHINE = "machine",
  MOBILITY = "mobility",
  BALANCE = "balance",
  SPECIALIZED = "specialized",
  OTHER = "other",
}

export interface Equipment {
  id: string;
  name: string;
  image?: string;
  equipmentType: EquipmentType;
}
