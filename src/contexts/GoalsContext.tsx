import { createContext, ReactNode, useState } from 'react';

interface GoalsContextProps {
  children: ReactNode;
}

type SelectedGoalData = {
  ref: string;
  category_description: string;
  days: number;
  daysCompleted: number;
  description: string;
  end_date: string;
  start_date: string;
  report_type: string;
  category: string;
  reports: [];
};

interface GoalsProviderProps {
  selectedGoal: SelectedGoalData;
  handleGoalsData: (data: SelectedGoalData) => void;
}

export const GoalsContext = createContext({} as GoalsProviderProps);

export function GoalsContextProvider({ children }: GoalsContextProps) {
  const [selectedGoal, setSelectedGoal] = useState<SelectedGoalData>();

  function handleGoalsData(data: SelectedGoalData): void {
    setSelectedGoal(data);
    return;
  }

  return (
    <GoalsContext.Provider value={{ selectedGoal, handleGoalsData }}>
      {children}
    </GoalsContext.Provider>
  );
}
