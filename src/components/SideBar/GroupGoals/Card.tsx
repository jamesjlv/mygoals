import { Flex, Text, Grid, useBreakpointValue } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useContext } from 'react';
import { GoalsContext } from '../../../contexts/GoalsContext';

interface CardProps {
  goal: {
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
  };
  closeMenu?: (boolean) => void;
}

export function Card({ goal, closeMenu }: CardProps) {
  const { selectedGoal, handleGoalsData } = useContext(GoalsContext);
  const isMobile = useBreakpointValue({ base: true, md: true, lg: true, xl: false });
  const { days, description } = goal;

  return (
    <Grid
      templateColumns="20% 1fr 20%"
      alignItems="center"
      justifyItems="center"
      width="100%"
      height="4rem"
      bg={selectedGoal?.ref === goal?.ref ? 'pink.600' : 'gray.700'}
      borderRadius="4"
      marginBottom="1rem"
      gap="2"
      onClick={() => {
        handleGoalsData({ ...goal });
        if (isMobile) {
          closeMenu(false);
        }
      }}
      cursor="pointer"
    >
      <Flex flexDirection="column" alignItems="center">
        <Text fontWeight="semibold">{days}</Text>
        <Text fontSize=".7rem">dias</Text>
      </Flex>
      <Flex width="100%">
        <Text fontSize="1rem">{description}</Text>
      </Flex>
      <Flex>
        <CheckIcon color={selectedGoal?.ref === goal?.ref ? 'pink.900' : 'pink.600'} />
      </Flex>
    </Grid>
  );
}
