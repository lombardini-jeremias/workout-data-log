export interface Set {
  id: string;                     // Unique identifier for the set
  setIndex: number;               // Set number (1st set, 2nd set, etc.)
  reps?: number;                  // Number of repetitions (if applicable)
  weight?: number;                // Weight lifted (if applicable)
  duration?: number;              // Duration of the set (if applicable, in seconds)
  distance?: number;              // Distance covered in the set (if applicable)
  restTime?: number;              // Rest time between sets (optional, in seconds)
  rpe?: number;                   // Rate of perceived exertion (optional)
  exerciseTypeId: string;         // Reference to the exercise type, used for set configuration
}
