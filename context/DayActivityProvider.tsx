import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context state
interface DayActivityContextType {
  selectedDayActivityId: string | null;
  setSelectedDayActivityId: (id: string | null) => void;
  selectedDayActivityName: string | null;
  setSelectedDayActivityName: (name: string | null) => void;
}

const DayActivityContext = createContext<DayActivityContextType | undefined>(
  undefined
);

// Context provider component
export const DayActivityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedDayActivityId, setSelectedDayActivityId] = useState<
    string | null
  >(null);
  const [selectedDayActivityName, setSelectedDayActivityName] = useState<
    string | null
  >(null);

  return (
    <DayActivityContext.Provider
      value={{
        selectedDayActivityId,
        setSelectedDayActivityId,
        selectedDayActivityName,
        setSelectedDayActivityName,
      }}
    >
      {children}
    </DayActivityContext.Provider>
  );
};

// Custom hook to use the DayActivityContext
export const useDayActivity = (): DayActivityContextType => {
  const context = useContext(DayActivityContext);
  if (!context) {
    throw new Error("useDayActivity must be used within a DayActivityProvider");
  }
  return context;
};
