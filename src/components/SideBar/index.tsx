import { Flex, Text, Stack, Grid, Spinner, Img, useBreakpointValue } from '@chakra-ui/react';
import { Search } from '../Search';
import { GroupGoals } from './GroupGoals';
import { PlusSquareIcon, CloseIcon } from '@chakra-ui/icons';
import { useContext, useState } from 'react';
import { GoalsContext } from '../../contexts/GoalsContext';
import { Button } from '../Button';

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
  closeMobile?: (boolean) => void;
}

export function SideBar({ goals, onOpen, closeMobile }: SideBarProps) {
  const { handleGoalsData } = useContext(GoalsContext);
  const [filter, setFilter] = useState('');
  const isMobile = useBreakpointValue({ base: true, md: true, lg: true, xl: false });
  function handleCreateForm() {
    handleGoalsData({} as SelectedGoalData);
    onOpen();
  }

  return (
    <Flex
      background="gray.800"
      w={['100%', '40%']}
      height={['100%', 'auto']}
      flexDirection="column"
    >
      <Flex
        flexDirection="row"
        align="center"
        justifyContent="space-between"
        margin="2rem 2.5rem 0"
      >
        <PlusSquareIcon onClick={handleCreateForm} />
        {isMobile && <CloseIcon onClick={() => closeMobile(false)} />}
      </Flex>
      <Search filter={setFilter} />
      <Stack alignItems="center" spacing="1rem">
        {goals[0] &&
          goals?.map((goal) => (
            <GroupGoals
              key={Math.random()}
              description={goal.description}
              goals={goal.goals}
              filter={filter}
              closeMobile={closeMobile}
            />
          ))}
        {!goals[0] && (
          <>
            <Img src="/empty.png" marginTop="50%" />
            <Flex width="80%" onClick={handleCreateForm}>
              <Button description="Crie uma nova meta" color="pink.500" width="100%" />
            </Flex>
          </>
        )}
      </Stack>
    </Flex>
  );
}
