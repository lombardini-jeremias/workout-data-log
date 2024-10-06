import React, { createContext, useState, useContext } from "react";
import { Exercise } from "../interfaces/Exercise.interfaces";

interface DayActivityContextProps {
  activityName: string;
  selectedExercises: Exercise[] | Exercise;
  setActivityName: (name: string) => void;
  setSelectedExercises: (exercises: Exercise[]) => void;
}

const DayActivityContext = createContext<DayActivityContextProps | undefined>(
  undefined
);

export const DayActivityProvider: React.FC = ({ children }) => {
  const [activityName, setActivityName] = useState<string>("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  return (
    <DayActivityContext.Provider
      value={{
        activityName,
        selectedExercises,
        setActivityName,
        setSelectedExercises,
      }}
    >
      {children}
    </DayActivityContext.Provider>
  );
};

export const useDayActivity = () => {
  const context = useContext(DayActivityContext);
  if (!context) {
    throw new Error("useDayActivity must be used within a DayActivityProvider");
  }
  return context;
};
