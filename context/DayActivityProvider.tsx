import React, { createContext, useState, useContext } from "react";

interface DayActivityContextProps {
  activityName: string;
  setActivityName: (name: string) => void;
}

const DayActivityContext = createContext<DayActivityContextProps | undefined>(
  undefined
);

export function useDayActivity() {
  const context = useContext(DayActivityContext);
  if (!context) {
    throw new Error("useDayActivity must be used within a DayActivityProvider");
  }
  return context;
}

export function DayActivityProvider({ children }) {
  const [activityName, setActivityName] = useState<string>("");

  return (
    <DayActivityContext.Provider
      value={{
        activityName,
        setActivityName,
      }}
    >
      {children}
    </DayActivityContext.Provider>
  );
}
