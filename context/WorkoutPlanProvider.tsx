// WorkoutPlanContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { WorkoutPlan } from "../interfaces/WorkoutPlan.interface";
import { Set } from "../interfaces/Set.interface";
import { ExerciseType } from "../interfaces/ExerciseType.interface";

interface WorkoutPlanState {
  workoutPlan: WorkoutPlan | null;
  sets: Set[];
  exerciseNames: { [key: string]: string };
  exerciseTypes: { [key: string]: ExerciseType | null };
}

const initialWorkoutPlanState: WorkoutPlanState = {
  workoutPlan: null,
  sets: [],
  exerciseNames: {},
  exerciseTypes: {},
};

const WorkoutPlanContext = createContext<{
  workoutPlanState: WorkoutPlanState;
  setWorkoutPlanState: React.Dispatch<React.SetStateAction<WorkoutPlanState>>;
} | null>(null);

export const WorkoutPlanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [workoutPlanState, setWorkoutPlanState] = useState<WorkoutPlanState>(
    initialWorkoutPlanState
  );

  useEffect(() => {
    console.log("WP-State CONTEXT", workoutPlanState);
  }, [workoutPlanState]);

  return (
    <WorkoutPlanContext.Provider
      value={{ workoutPlanState, setWorkoutPlanState }}
    >
      {children}
    </WorkoutPlanContext.Provider>
  );
};

export const useWorkoutPlan = () => {
  const context = useContext(WorkoutPlanContext);
  if (!context) {
    throw new Error("useWorkoutPlan must be used within a WorkoutPlanProvider");
  }
  return context;
};
