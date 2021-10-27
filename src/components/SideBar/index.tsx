import { Flex, Text, Stack, Grid, Spinner, Icon } from '@chakra-ui/react';
import { Search } from '../Search';
import { GroupGoals } from './GroupGoals';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { useContext, useState } from 'react';
import { GoalsContext } from '../../contexts/GoalsContext';

type GoalsData = {
  description?: string;
  goals?: {
    ref: string;
    category_description: string;
    daysCompleted: number;
    days: number;
    description: string;
    end_date: string;
    start_date: string;
    report_type: string;
    category: string;
    reports: [];
  }[];
}[];

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

interface SideBarProps {
  goals: GoalsData;
  setSelectedGoal?: () => {};
  onOpen: () => void;
}

export function SideBar({ goals, onOpen }: SideBarProps) {
  const { handleGoalsData } = useContext(GoalsContext);
  const [filter, setFilter] = useState('');
  function handleCreateForm() {
    handleGoalsData({} as SelectedGoalData);
    onOpen();
  }

  return (
    <Flex background="gray.800" w="40%" height="auto" flexDirection="column">
      <PlusSquareIcon margin="2rem 2.5rem 0" onClick={handleCreateForm} />
      <Search filter={setFilter} />
      <Stack alignItems="center" spacing="1rem">
        {goals[0] &&
          goals?.map((goal) => (
            <GroupGoals
              key={Math.random()}
              description={goal.description}
              goals={goal.goals}
              filter={filter}
            />
          ))}
        {!goals[0] && <Spinner />}
      </Stack>
    </Flex>
  );
}
