import { createContext, ReactNode, useState } from 'react';
import { getSession, useSession } from 'next-auth/client';
import { SyncUserGoals } from '../services/SyncUserGoals';

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
  reloadGoalsData: (ref?: string) => void;
  goals: GoalsData;
  setGoals: (data: GoalsData) => void;
}
type GoalsData = {
  description: string;
  ref: string;
  goals: {
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
  }[];
}[];

export const GoalsContext = createContext({} as GoalsProviderProps);

export function GoalsContextProvider({ children }: GoalsContextProps) {
  const [selectedGoal, setSelectedGoal] = useState<SelectedGoalData>();
  const [session, loading] = useSession();
  const [goals, setGoals] = useState<GoalsData>({} as GoalsData);

  function handleGoalsData(data): void {
    setSelectedGoal(data);
    return;
  }
  async function reloadGoalsData(ref?: string): Promise<void> {
    const goals = await SyncUserGoals(session);
    setGoals(goals);
    if (ref) {
      let goalUpdated = {} as SelectedGoalData;
      goals.map((goal) =>
        goal.goals.map((item) => {
          if (item.ref === ref) {
            goalUpdated = { category_description: goal.description, ...item };
          }
        })
      );
      setSelectedGoal(goalUpdated);
    }
    return;
  }

  return (
    <GoalsContext.Provider
      value={{ selectedGoal, handleGoalsData, reloadGoalsData, goals, setGoals }}
    >
      {children}
    </GoalsContext.Provider>
  );
}
