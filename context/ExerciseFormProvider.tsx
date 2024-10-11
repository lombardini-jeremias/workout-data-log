import React, { createContext, useContext, useState } from "react";

interface ExerciseFormState {
  name: string;
  equipmentId: string;
  equipmentName: string;
  primaryMuscleGroupId: string;
  primaryMuscleGroupName: string;
  secondaryMuscleGroupId: string;
  secondaryMuscleGroupName: string;
  exerciseTypeId: string;
  exerciseTypeName: string;
}

const initialFormState: ExerciseFormState = {
  name: "",
  equipmentId: "",
  equipmentName: "",
  primaryMuscleGroupId: "",
  primaryMuscleGroupName: "",
  secondaryMuscleGroupId: "",
  secondaryMuscleGroupName: "",
  exerciseTypeId: "",
  exerciseTypeName: "",
};

// Create the context
const ExerciseFormContext = createContext<{
  exerciseForm: ExerciseFormState;
  setExerciseForm: React.Dispatch<React.SetStateAction<ExerciseFormState>>;
} | null>(null);

// Create a provider component
export const ExerciseFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [exerciseForm, setExerciseForm] =
    useState<ExerciseFormState>(initialFormState);

  return (
    <ExerciseFormContext.Provider value={{ exerciseForm, setExerciseForm }}>
      {children}
    </ExerciseFormContext.Provider>
  );
};

// Create a custom hook for accessing the context
export const useExerciseForm = () => {
  const context = useContext(ExerciseFormContext);
  if (!context) {
    throw new Error(
      "useExerciseForm must be used within an ExerciseFormProvider"
    );
  }
  return context;
};
