import { Flex, Text, Stack, Grid, Spinner, Icon } from '@chakra-ui/react';
import { Search } from '../Search';
import { GroupGoals } from './GroupGoals';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { useContext } from 'react';
import { GoalsContext } from '../../contexts/GoalsContext';

type GoalsData = {
  description?: string;
  goals?: {
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

  function handleCreateForm() {
    handleGoalsData({} as SelectedGoalData);
    onOpen();
  }

  return (
    <Flex background="gray.800" w="40%" height="100%" flexDirection="column">
      <PlusSquareIcon margin="2rem 2.5rem 0" onClick={handleCreateForm} />
      <Search />
      <Stack alignItems="center" spacing="1rem">
        {goals[0] &&
          goals?.map((goal) => (
            <GroupGoals key={Math.random()} description={goal.description} goals={goal.goals} />
          ))}
        {!goals[0] && <Spinner />}
      </Stack>
    </Flex>
  );
}
